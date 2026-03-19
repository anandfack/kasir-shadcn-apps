import { newGenerateDocumentNumber } from "@/lib/documentNumber";
import { prisma } from "@/lib/prisma";

export async function createReturPenerimaanRepo(data) {
  return prisma.$transaction(async (tx) => {
    const nomorRetur = await newGenerateDocumentNumber({
      tx,
      prefix: "RTR-PN",
      tanggal: new Date(),
    });
    const nomorMutasi = await newGenerateDocumentNumber({
      tx,
      prefix: "MT",
      tanggal: new Date(),
    });

    const penerimaan = await tx.penerimaanBarang.findUnique({
      where: { id: Number(data.penerimaan_id) },
    });

    if (!penerimaan) {
      return jsonResponse({ message: "Penerimaan tidak ditemukan" }, 404);
    }

    const retur = await tx.returPenerimaan.create({
      data: {
        penerimaanbarang_id: penerimaan.id,
        nomor_retur: nomorRetur,
        tanggal_retur: new Date(data.tanggal_retur),
        total_harga: Number(data.total_harga),
        alasan_retur: `Retur Penerimaan ${penerimaan.nomor_penerimaan}`,
        status: "SUCCESS",
      },
    });

    for (let i = 0; i < data.details_retur.length; i++) {
      const item = data.details_retur[i];

      if (
        !item.produkvariant_id ||
        !item.jumlah_produk ||
        !item.harga_satuan ||
        item.jumlah_produk <= 0 ||
        isNaN(Number(item.harga_satuan)) ||
        Number(item.harga_satuan) < 0
      ) {
        throw new Error("Detail retur tidak valid");
      }

      const stok = await tx.stokVariant.findUnique({
        where: { produk_variant_id: item.produkvariant_id },
      });

      if (!stok) {
        throw new Error("Stok produk variant tidak ditemukan");
      }

      if (stok.jumlah_stok < item.jumlah_produk) {
        throw new Error("Jumlah retur melebihi stok tersedia");
      }

      const hargaSatuan = Number(item.harga_satuan);
      const jumlahProduk = Number(item.jumlah_produk);
      const totalHargaProduk = hargaSatuan * jumlahProduk;

      await tx.detailReturPenerimaan.create({
        data: {
          returPenerimaan: {
            connect: { id: retur.id },
          },
          penerimaanBarangDetail: {
            connect: { id: item.detail_penerimaan_id },
          },
          jumlah_produk: jumlahProduk,
          harga_satuan: hargaSatuan,
          total_harga: totalHargaProduk,
          keterangan_retur: item.keterangan,
        },
      });

      await tx.penerimaanBarangDetail.update({
        where: { id: item.detail_penerimaan_id },
        data: { qty_retur: { increment: jumlahProduk } },
      });

      await tx.mutasiStokVariant.create({
        data: {
          produk_variant_id: item.produkvariant_id,
          tipe_mutasi: "KELUAR",
          jumlah_mutasi: jumlahProduk,
          keterangan_mutasi: `Retur Penerimaan ${penerimaan.nomor_penerimaan}`,
          tanggal_mutasi: new Date(),
          nomor_mutasi: nomorMutasi,
        },
      });

      await tx.stokVariant.update({
        where: { produk_variant_id: item.produkvariant_id },
        data: {
          jumlah_stok: stok.jumlah_stok - jumlahProduk,
        },
      });
    }

    // cari invoice dari penerimaan
    // =============================
    // CARI INVOICE BERDASARKAN PENERIMAAN
    // =============================
    const invoice = await tx.invoicePembelian.findFirst({
      where: {
        invoicePenerimaans: {
          some: {
            penerimaan_id: penerimaan.id,
          },
        },
      },
    });

    if (invoice) {
      // =============================
      // TOTAL PEMBAYARAN
      // =============================
      const pembayaran = await tx.pembayaranInvoice.aggregate({
        where: {
          invoice_id: invoice.id,
          deleted_at: null,
        },
        _sum: {
          jumlah_bayar: true,
        },
      });

      const totalBayar = Number(pembayaran._sum.jumlah_bayar || 0);

      // =============================
      // TOTAL RETUR
      // =============================
      const returAgg = await tx.returPenerimaan.aggregate({
        where: {
          penerimaanbarang_id: penerimaan.id,
          deleted_at: null,
        },
        _sum: {
          total_harga: true,
        },
      });

      const totalRetur = Number(returAgg._sum.total_harga || 0);

      // =============================
      // HITUNG TOTAL TAGIHAN BARU
      // =============================
      const totalTagihanBaru = Math.max(
        Number(invoice.total_tagihan) - totalRetur,
        0,
      );

      // =============================
      // HITUNG SISA TAGIHAN
      // =============================
      const sisaTagihan = Math.max(totalTagihanBaru - totalBayar, 0);

      // =============================
      // STATUS INVOICE
      // =============================
      let status = "UNPAID";

      if (totalBayar >= totalTagihanBaru && totalTagihanBaru > 0) {
        status = "PAID";
      } else if (totalBayar > 0 && totalBayar < totalTagihanBaru) {
        status = "PARTIAL";
      }

      // =============================
      // UPDATE INVOICE
      // =============================
      await tx.invoicePembelian.update({
        where: { id: invoice.id },
        data: {
          total_tagihan: totalTagihanBaru,
          sisa_tagihan: sisaTagihan,
          status: status,
        },
      });
    }
    return retur;
  });
}
