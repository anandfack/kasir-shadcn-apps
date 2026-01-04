import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    // const auth = verifyAuth(req);

    // if (auth.error) {
    //   return jsonResponse({ message: auth.error }, 401);
    // }

    const produkId = parseInt(params.id);

    const mutasiStok = await prisma.mutasiStok.findMany({
      where: {
        produk_id: produkId,
        deleted_at: null,
      },
      orderBy: {
        tanggal_mutasi: "desc",
      },

      select: {
        id: true,
        produk_id: true,
        nomor_mutasi: true,
        tanggal_mutasi: true,
        tipe_mutasi: true,
        jumlah_mutasi: true,
        keterangan_mutasi: true,
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
    });

    return jsonResponse(
      {
        message: "OK",
        data: mutasiStok,
      },
      200
    );
  } catch (error) {
    console.error("Eror:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
