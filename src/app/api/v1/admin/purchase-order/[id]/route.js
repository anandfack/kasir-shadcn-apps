import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = parseInt(params.id);

    const detailPurchaseOrder = await prisma.purchaseOrder.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_po: true,
        tanggal_po: true,
        status_po: true,
        total_harga: true,
        details: {
          select: {
            id: true,
            harga_satuan: true,
            jumlah_produk: true,
            qty_diterima: true,
            total_harga: true,
            produkVariant: {
              select: {
                id: true,
                sku: true,
                ukuran: true,
                warna: true,
                satuan: {
                  select: {
                    id: true,
                    nama_satuan: true,
                    kode_satuan: true,
                  },
                },
                produk: {
                  select: {
                    id: true,
                    nama_produk: true,
                    kode_produk: true,
                  },
                },
              },
            },
          },
        },
        supplier: {
          select: {
            id: true,
            nama_supplier: true,
            alamat_supplier: true,
          },
        },
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
        // ReturPembelian: {
        //   select: {
        //     id: true,
        //     nomor_retur: true,
        //     tanggal_retur: true,
        //     total_harga: true,
        //     keterangan_retur: true,
        //     DetailReturPembelian: {
        //       select: {
        //         id: true,
        //         harga_satuan: true,
        //         jumlah_produk: true,
        //         total_harga: true,
        //         produk: {
        //           select: {
        //             id: true,
        //             nama_produk: true,
        //             kode_produk: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: detailPurchaseOrder,
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
