import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { generateDocumentNumber } from "@/lib/documentNumber";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const purchaseOrder = await prisma.purchaseOrder.findMany({
      select: {
        id: true,
        nomor_po: true,
        tanggal_po: true,
        status_po: true,
        total_harga: true,
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
        supplier: {
          select: {
            id: true,
            kode_supplier: true,
            nama_supplier: true,
          },
        },
        details: {
          select: {
            jumlah_produk: true,
            qty_diterima: true,
          },
        },
        // pembayaranPembelian: {
        //   select: {
        //     jumlah_bayar: true,
        //   },
        // },
      },
      where: {
        deleted_at: null,
      },
    });

    const result = purchaseOrder.map((po) => {
      const totalQtyPO = po.details.reduce(
        (sum, d) => sum + d.jumlah_produk,
        0,
      );

      const totalQtyDiterima = po.details.reduce(
        (sum, d) => sum + d.qty_diterima,
        0,
      );

      const progressPersen =
        totalQtyPO === 0
          ? 0
          : Math.round((totalQtyDiterima / totalQtyPO) * 100);

      return {
        ...po,
        total_qty_po: totalQtyPO,
        total_qty_diterima: totalQtyDiterima,
        progress: `${totalQtyDiterima} / ${totalQtyPO}`,
        progress_persen: progressPersen,
      };
    });

    // function hitungStatusPembayaran(pembayaran, totalTagihan) {
    //   const totalBayar =
    //     pembayaran?.reduce((sum, p) => sum + p.jumlah_bayar, 0) ?? 0;

    //   if (totalBayar === 0) return "BELUM_BAYAR";
    //   if (totalBayar > totalTagihan) return "OVERPAID";
    //   if (totalBayar >= totalTagihan) return "LUNAS";
    //   return "SEBAGIAN";
    // }

    // const result = pembelianProduk.map((p) => {
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
        data: result,
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

// app/api/pembelian/route.js

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { supplier_id, tanggal_po, total_harga, detail_items } = body;

    const errors = {};

    if (!supplier_id) {
      errors.supplier_id = "Supplier wajib diisi";
    } else if (isNaN(Number(supplier_id))) {
      errors.supplier_id = "Supplier tidak valid";
    }

    if (!tanggal_po || tanggal_po.trim() === "") {
      errors.tanggal_po = "Tanggal pembelian wajib diisi";
    }
    if (!tanggal_po || tanggal_po.trim() === "") {
      errors.tanggal_po = "Tanggal pembelian wajib diisi";
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

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 422);
    }

    const result = await prisma.$transaction(async (tx) => {
      const nomorPO = await generateDocumentNumber({
        tx,
        model: "purchaseOrder",
        field: "nomor_po",
        prefix: "PO",
        tanggal: tanggal_po,
      });

      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          supplier_id,
          nomor_po: nomorPO,
          pegawai_id: auth.user?.id,
          status_po: "DRAFT",
          total_harga,
          tanggal_po: new Date(tanggal_po),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      if (Array.isArray(detail_items) && detail_items.length > 0) {
        await Promise.all(
          detail_items.map(async (item, index) => {
            await tx.purchaseOrderDetail.create({
              data: {
                purchase_order_id: purchaseOrder.id,
                produk_variant_id: item.produk_variant_id,
                harga_satuan: item.harga_satuan,
                jumlah_produk: item.jumlah_produk,
                total_harga: item.total_harga,
                created_at: new Date(),
                updated_at: new Date(),
                pegawai_id: auth.user?.id,
              },
            });
          }),
        );
      }

      return purchaseOrder;
    });
    return jsonResponse(
      {
        message: "Data purchase order berhasil ditambahkan",
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
