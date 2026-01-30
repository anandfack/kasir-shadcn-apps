import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    function getStatus(stok) {
      if (!stok) return "Belum Diatur";
      if (stok.jumlah_stok <= 0) return "Habis";
      if (stok.jumlah_stok <= stok.minimal_stok) return "Menipis";
      if (stok.jumlah_stok >= stok.maksimal_stok) return "Berlebih";
      return "Aman";
    }

    const produkVariant = await prisma.produkVariant.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        produk: {
          select: {
            id: true,
            nama_produk: true,
          },
        },
        stok: true,
      },
      orderBy: {
        produk: {
          nama_produk: "asc",
        },
      },
    });

    const result = produkVariant.map((item) => {
      const stok = item.stok ?? null;

      return {
        id: item.id,
        sku: item.sku,
        warna: item.warna,
        ukuran: item.ukuran,

        // PRODUK
        produk_id: item?.produk?.id ?? null,
        nama_produk: item?.produk?.nama_produk ?? null,

        jumlah_stok: stok?.jumlah_stok ?? null,
        minimal_stok: stok?.minimal_stok ?? null,
        maksimal_stok: stok?.maksimal_stok ?? null,

        status: getStatus(stok),
        terakhir_update: stok?.updated_at ?? null,

        has_stok: !!stok,
      };
    });

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
