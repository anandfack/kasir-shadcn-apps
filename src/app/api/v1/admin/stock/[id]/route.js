import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const body = await req.json();
    const { minimal_stok, maksimal_stok } = body;

    const minimal = Number(minimal_stok);
    const maksimal = Number(maksimal_stok);

    const errors = {};

    if (minimal !== undefined) {
      if (minimal === null || minimal === "") {
        errors.minimal = "Nilai minimal tidak boleh kosong";
      } else if (isNaN(Number(minimal))) {
        errors.minimal = "Nilai minimal harus berupa angka";
      } else if (Number(minimal) < 0) {
        errors.minimal = "Nilai minimal tidak boleh kurang dari 0";
      }
    }
    if (maksimal !== undefined) {
      if (maksimal === null || maksimal === "") {
        errors.maksimal = "Nilai maksimal tidak boleh kosong";
      } else if (isNaN(Number(maksimal))) {
        errors.maksimal = "Nilai maksimal harus berupa angka";
      } else if (Number(maksimal) < 0) {
        errors.maksimal = "Nilai maksimal tidak boleh kurang dari 0";
      }
    }

    const stok = await prisma.stok.upsert({
      where: {
        produk_id: parseInt(id, 10),
      },
      update: {
        minimal_stok: minimal,
        maksimal_stok: maksimal,
      },
      create: {
        produk_id: parseInt(id, 10),
        jumlah_stok: 0,
        minimal_stok: minimal,
        maksimal_stok: maksimal,
      },
    });

    return jsonResponse(
      {
        message: "Stock berhasil diperbarui",
        data: stok,
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
};
