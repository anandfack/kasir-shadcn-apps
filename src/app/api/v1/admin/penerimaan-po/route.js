import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { newGenerateDocumentNumber } from "@/lib/documentNumber";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const penerimaan = await prisma.penerimaanBarang.findMany({
      select: {
        id: true,
        purchaseOrder: {
          select: {
            id: true,
            nomor_po: true,
            supplier: {
              select: {
                id: true,
                nama_supplier: true,
              },
            },
          },
        },
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
        nomor_penerimaan: true,
        tanggal_penerimaan: true,
        status_penerimaan: true,
        details: {
          select: {
            jumlah_produk: true,
            total_harga: true,
          },
        },
      },
      where: {
        deleted_at: null,
      },
    });

    // function hitungStatusPembayaran(pembayaran, totalTagihan) {
    //   const totalBayar =
    //     pembayaran?.reduce((sum, p) => sum + p.jumlah_bayar, 0) ?? 0;

    //   if (totalBayar === 0) return "BELUM_BAYAR";
    //   if (totalBayar > totalTagihan) return "OVERPAID";
    //   if (totalBayar >= totalTagihan) return "LUNAS";
    //   return "SEBAGIAN";
    // }

    // const result = penerimaan.map((p) => {
    //   const totalBayar = p.pembayaranPembelian.reduce(
    //     (sum, pay) => sum + pay.jumlah_bayar,
    //     0,
    //   );

    //   return {
    //     ...p,
    //     total_bayar: totalBayar,
    //     status_pembayaran: hitungStatusPembayaran(
    //       p.pembayaranPembelian,
    //       p.total_harga,
    //     ),
    //   };
    // });
    return jsonResponse(
      {
        message: "OK",
        data: penerimaan,
      },
      200,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const {
      purchase_order_id,
      tanggal_penerimaan,
      total_harga,
      nomor_faktur,
      tanggal_faktur,
      nomor_surat_jalan,
      tanggal_surat_jalan,
      details_penerimaan,
    } = body;

    const pegawai_id = auth.user.id;

    const errors = {};

    if (!purchase_order_id) {
      errors.purchase_order_id = "Purchase order wajib diisi";
    }

    if (
      total_harga === undefined ||
      total_harga === null ||
      total_harga === ""
    ) {
      errors.total_harga = "Total harga wajib diisi";
    } else if (isNaN(Number(total_harga))) {
      errors.total_harga = "Total harga harus berupa angka";
    } else if (Number(total_harga) < 0) {
      errors.total_harga = "Total harga tidak boleh kurang dari 0";
    }

    if (!details_penerimaan || details_penerimaan.length === 0) {
      errors.details = "Detail penerimaan wajib diisi";
    }

    if (!tanggal_penerimaan || tanggal_penerimaan.trim() === "") {
      errors.tanggal_penerimaan = "Tanggal penerimaan wajib diisi";
    }
    if (!tanggal_faktur || tanggal_faktur.trim() === "") {
      errors.tanggal_faktur = "Tanggal faktur wajib diisi";
    }
    if (!tanggal_surat_jalan || tanggal_surat_jalan.trim() === "") {
      errors.tanggal_surat_jalan = "Tanggal surat jalan wajib diisi";
    }
    if (!nomor_faktur || nomor_faktur.trim() === "") {
      errors.nomor_faktur = "Tanggal surat jalan wajib diisi";
    }
    if (!nomor_surat_jalan || nomor_surat_jalan.trim() === "") {
      errors.nomor_surat_jalan = "Tanggal surat jalan wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const nomorPenerimaan = await newGenerateDocumentNumber({
        tx,
        prefix: "PB",
        tanggal: new Date(),
      });

      const penerimaanPo = await tx.penerimaanBarang.create({
        data: {
          purchase_order_id: purchase_order_id,
          pegawai_id: pegawai_id,
          nomor_penerimaan: nomorPenerimaan,
          tanggal_penerimaan: new Date(tanggal_penerimaan),
          status_penerimaan: "SELESAI",
          nomor_faktur: nomor_faktur,
          tanggal_faktur: new Date(tanggal_faktur),
          nomor_surat_jalan: nomor_surat_jalan,
          tanggal_surat_jalan: new Date(tanggal_surat_jalan),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      for (const item of details_penerimaan) {
        if (!item.purchase_order_detail_id) {
          throw new Error("Detail PO wajib ada");
        }

        if (item.jumlah_produk <= 0) {
          throw new Error("Qty harus lebih dari 0");
        }

        const poDetail = await tx.purchaseOrderDetail.findUnique({
          where: { id: item.purchase_order_detail_id },
        });

        if (!poDetail) {
          throw new Error("Detail PO tidak ditemukan");
        }

        if (poDetail.purchase_order_id !== purchase_order_id) {
          throw new Error("Detail tidak sesuai PO");
        }

        const sisaQty = poDetail.jumlah_produk - (poDetail.qty_diterima ?? 0);

        if (item.jumlah_produk > sisaQty) {
          throw new Error("Qty melebihi sisa PO");
        }

        const nomorMutasi = await newGenerateDocumentNumber({
          tx,
          prefix: "MT",
          tanggal: new Date(),
        });

        await tx.penerimaanBarangDetail.create({
          data: {
            penerimaan_barang_id: penerimaanPo.id,
            purchase_order_detail_id: poDetail.id,
            produk_variant_id: item.produk_variant_id,
            harga_satuan: item.harga_satuan,
            jumlah_produk: item.jumlah_produk,
            total_harga: item.total_harga,
            pegawai_id,
          },
        });

        await tx.purchaseOrderDetail.update({
          where: { id: poDetail.id },
          data: {
            qty_diterima: {
              increment: item.jumlah_produk,
            },
          },
        });

        await tx.mutasiStokVariant.create({
          data: {
            produk_variant_id: item.produk_variant_id,
            tipe_mutasi: "MASUK",
            jumlah_mutasi: item.jumlah_produk,
            keterangan_mutasi: nomorPenerimaan,
            pegawai_id,
            tanggal_mutasi: new Date(),
            nomor_mutasi: nomorMutasi,
          },
        });

        await tx.stokVariant.upsert({
          where: {
            produk_variant_id: item.produk_variant_id,
          },
          update: {
            jumlah_stok: {
              increment: item.jumlah_produk,
            },
          },
          create: {
            produk_variant_id: item.produk_variant_id,
            jumlah_stok: item.jumlah_produk,
            minimal_stok: 0,
            maksimal_stok: 0,
          },
        });
      }

      const updatedDetails = await tx.purchaseOrderDetail.findMany({
        where: { purchase_order_id },
      });

      const allComplete =
        updatedDetails.length > 0 &&
        updatedDetails.every((d) => d.qty_diterima >= d.jumlah_produk);

      const someReceived = updatedDetails.some((d) => d.qty_diterima > 0);

      let status_po = "OPEN";

      if (allComplete) {
        status_po = "COMPLETE";
      } else if (someReceived) {
        status_po = "PARTIAL";
      }

      await tx.purchaseOrder.update({
        where: { id: purchase_order_id },
        data: { status_po },
      });

      return penerimaanPo;
    });

    return jsonResponse(
      {
        message: "Data pembelian berhasil ditambahkan",
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
