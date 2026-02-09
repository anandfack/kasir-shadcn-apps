import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { generateDocumentNumber } from "@/lib/documentNumber";

const prisma = new PrismaClient();

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
    if (!tanggal_penerimaan || tanggal_penerimaan.trim() === "") {
      errors.tanggal_penerimaan = "Tanggal penerimaan wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const nomorPenerimaan = await generateDocumentNumber({
        tx,
        model: "penerimaanBarang",
        field: "nomor_penerimaan",
        prefix: "PB",
        tanggal: new Date(),
      });
      const nomorMutasi = await generateDocumentNumber({
        tx,
        model: "mutasiStokVariant",
        field: "nomor_mutasi",
        prefix: "MT",
        tanggal: new Date(),
      });

      const penerimaanPo = await tx.penerimaanBarang.create({
        data: {
          purchase_order_id: purchase_order_id,
          pegawai_id: pegawai_id,
          nomor_penerimaan: nomorPenerimaan,
          tanggal_penerimaan: new Date(tanggal_penerimaan),
          status_penerimaan: "SELESAI",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      for (const item of details_penerimaan) {
        const poDetail = await tx.purchaseOrderDetail.findFirst({
          where: {
            purchase_order_id: purchase_order_id,
            produk_variant_id: item.produk_variant_id,
          },
        });

        if (!poDetail) {
          throw new Error("Detail PO tidak ditemukan");
        }

        await tx.penerimaanBarangDetail.create({
          data: {
            penerimaan_barang_id: penerimaanPo.id,
            produk_variant_id: item.produk_variant_id,
            harga_satuan: item.harga_satuan,
            jumlah_produk: item.jumlah_produk,
            total_harga: item.total_harga,
            pegawai_id: pegawai_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        const totalDiterima = (poDetail.qty_diterima ?? 0) + item.jumlah_produk;

        if (totalDiterima > poDetail.jumlah_produk) {
          throw new Error("Qty penerimaan melebihi qty PO");
        }

        await tx.purchaseOrderDetail.update({
          where: {
            id: poDetail.id,
          },
          data: {
            qty_diterima: totalDiterima,
          },
        });

        const stokVariant = await tx.stokVariant.findUnique({
          where: {
            produk_variant_id: item.produk_variant_id,
          },
        });
        if (stokVariant) {
          await tx.stokVariant.update({
            where: {
              id: stokVariant.id,
            },
            data: {
              jumlah_stok: stokVariant.jumlah_stok + item.jumlah_produk,
            },
          });
        } else {
          await tx.stokVariant.create({
            data: {
              produk_variant_id: item.produk_variant_id,
              jumlah_stok: item.jumlah_produk,
              minimal_stok: 0,
              maksimal_stok: 0,
            },
          });
        }

        await tx.mutasiStokVariant.create({
          data: {
            produk_variant_id: item.produk_variant_id,
            tipe_mutasi: "MASUK",
            jumlah_mutasi: item.jumlah_produk,
            keterangan_mutasi: nomorPenerimaan,
            pegawai_id: pegawai_id,
            tanggal_mutasi: new Date(),
            nomor_mutasi: nomorMutasi,
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
