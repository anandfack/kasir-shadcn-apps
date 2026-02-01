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

    const produkVariantId = parseInt(params.id);

    const mutasiStokVariant = await prisma.mutasiStokVariant.findMany({
      where: {
        produk_variant_id: produkVariantId,
        deleted_at: null,
      },
      orderBy: {
        tanggal_mutasi: "desc",
      },

      select: {
        id: true,
        produk_variant_id: true,
        nomor_mutasi: true,
        tanggal_mutasi: true,
        tipe_mutasi: true,
        jumlah_mutasi: true,
        keterangan_mutasi: true,
        produkVariant: {
          select: {
            id: true,
            warna: true,
            ukuran: true,
            sku: true,
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
    });

    return jsonResponse(
      {
        message: "OK",
        data: mutasiStokVariant,
      },
      200,
    );
  } catch (error) {
    console.error("Eror:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
