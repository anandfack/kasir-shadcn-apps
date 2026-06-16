import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { requirePermission, ForbiddenError } from "@/lib/permission";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    try {
      await requirePermission(auth.user.id, "purchase-order.view");
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return jsonResponse({ message: error.message }, 403);
      }
      throw error;
    }

    const id = parseInt(params.id);

    const detailPembelianProduk = await prisma.pembelian.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_pembelian: true,
        tanggal_pembelian: true,
        status_pembelian: true,
        total_harga: true,
        nomor_faktur: true,
        DetailPembelian: {
          select: {
            id: true,
            harga_satuan: true,
            jumlah_produk: true,
            harga_produk: true,
            total_harga: true,
            produk: {
              select: {
                id: true,
                nama_produk: true,
                kode_produk: true,
                satuan: {
                  select: {
                    id: true,
                    nama_satuan: true,
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
        ReturPembelian: {
          select: {
            id: true,
            nomor_retur: true,
            tanggal_retur: true,
            total_harga: true,
            keterangan_retur: true,
            DetailReturPembelian: {
              select: {
                id: true,
                harga_satuan: true,
                jumlah_produk: true,
                total_harga: true,
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
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: detailPembelianProduk,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
