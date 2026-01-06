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

    const detailReturProduk = await prisma.returPembelian.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_retur: true,
        tanggal_retur: true,
        total_harga: true,
        pembelian: {
          select: {
            id: true,
            nomor_pembelian: true,
            nomor_faktur: true,
            supplier: {
              select: {
                id: true,
                nama_supplier: true,
              },
            },
          },
        },
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
        keterangan_retur: true,
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: detailReturProduk,
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
