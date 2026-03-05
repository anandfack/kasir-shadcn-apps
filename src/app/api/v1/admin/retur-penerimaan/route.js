import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { newGenerateDocumentNumber } from "@/lib/documentNumber";
// import { date } from "zod";

const prisma = new PrismaClient();

// export async function GET(req) {
//   try {
//     const auth = verifyAuth(req);

//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const returProduk = await prisma.returPembelian.findMany({
//       where: {
//         deleted_at: null,
//       },
//       select: {
//         id: true,
//         nomor_retur: true,
//         tanggal_retur: true,
//         total_harga: true,
//         pembelian: {
//           select: {
//             id: true,
//             nomor_pembelian: true,
//             nomor_faktur: true,
//             supplier: {
//               select: {
//                 id: true,
//                 nama_supplier: true,
//               },
//             },
//           },
//         },
//         DetailReturPembelian: {
//           select: {
//             id: true,
//             produk: {
//               select: {
//                 id: true,
//                 nama_produk: true,
//                 kode_produk: true,
//                 satuan: {
//                   select: {
//                     id: true,
//                     nama_satuan: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         keterangan_retur: true,
//       },
//     });
//     return jsonResponse(
//       {
//         message: "OK",
//         data: returProduk,
//       },
//       200
//     );
//   } catch (error) {
//     console.log("Error:", error);
//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// }

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { penerimaan_id, tanggal_retur, total_harga, details_retur } = body;

    const errors = {};

    if (!penerimaan_id || isNaN(Number(penerimaan_id))) {
      errors.penerimaan_id = "Pembelian tidak valid";
    }

    if (
      total_harga === undefined ||
      total_harga === null ||
      isNaN(Number(total_harga)) ||
      Number(total_harga) < 0
    ) {
      errors.total_harga = "Total harga tidak valid";
    }

    if (!Array.isArray(details_retur) || details_retur.length === 0) {
      errors.details_retur = "Detail retur wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ errors }, 422);
    }

    const result = await prisma.$transaction(async (tx) => {
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
        where: { id: Number(penerimaan_id) },
      });

      if (!penerimaan) {
        return jsonResponse({ message: "Penerimaan tidak ditemukan" }, 404);
      }

      const retur = await tx.returPenerimaan.create({
        data: {
          penerimaanbarang_id: penerimaan.id,
          nomor_retur: nomorRetur,
          tanggal_retur: new Date(tanggal_retur),
          total_harga: Number(total_harga),
          alasan_retur: `Retur Penerimaan ${penerimaan.nomor_penerimaan}`,
          status: "SUCCESS",
        },
      });

      for (let i = 0; i < details_retur.length; i++) {
        const item = details_retur[i];

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

    return jsonResponse(
      {
        message: "Retur penerimaan berhasil ditambahkan",
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error :", error);

    return jsonResponse(
      {
        message: error.message || "Internal Server Error",
      },
      500,
    );
  }
}
