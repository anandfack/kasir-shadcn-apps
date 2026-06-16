import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { requirePermission, ForbiddenError } from "@/lib/permission";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    try {
      await requirePermission(auth.user.id, "stock-produk.view");
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return jsonResponse({ message: error.message }, 403);
      }
      throw error;
    }

    function getStatus(stok) {
      if (!stok) return "Belum Diatur";
      if (stok.jumlah_stok <= 0) return "Habis";
      if (stok.jumlah_stok <= stok.minimal_stok) return "Menipis";
      if (stok.jumlah_stok >= stok.maksimal_stok) return "Berlebih";
      return "Aman";
    }

    const produk = await prisma.produk.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_produk: "asc",
      },
      include: {
        Stok: true,
      },
    });

    const result = produk.map((item) => {
      const stok = item.Stok?.[0] ?? null;

      return {
        id: item.id,
        nama_produk: item.nama_produk,

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
