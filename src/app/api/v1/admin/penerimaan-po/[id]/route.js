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

    const detailPenerimaanPo = await prisma.penerimaanBarang.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_penerimaan: true,
        tanggal_penerimaan: true,
        status_penerimaan: true,
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
        details: {
          select: {
            id: true,
            jumlah_produk: true,
            harga_satuan: true,
            produkVariant: {
              select: {
                id: true,
                sku: true,
                ukuran: true,
                warna: true,
                produk: {
                  select: {
                    id: true,
                    nama_produk: true,
                    kode_produk: true,
                  },
                },
                satuan: {
                  select: {
                    id: true,
                    nama_satuan: true,
                    kode_satuan: true,
                  },
                },
              },
            },
            purchaseOrderDetail: {
              select: {
                id: true,
                jumlah_produk: true,
                qty_diterima: true,
                harga_satuan: true,
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
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: detailPenerimaanPo,
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
