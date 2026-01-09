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

    if (
      minimal_stok === undefined ||
      minimal_stok === null ||
      minimal_stok === ""
    ) {
      errors.minimal_stok = "Nilai minimal tidak boleh kosong";
    } else if (isNaN(minimal_stok)) {
      errors.minimal_stok = "Nilai minimal harus berupa angka";
    } else if (Number(minimal_stok) < 0) {
      errors.minimal_stok = "Nilai minimal tidak boleh kurang dari 0";
    }

    if (
      maksimal_stok === undefined ||
      maksimal_stok === null ||
      maksimal_stok === ""
    ) {
      errors.maksimal_stok = "Nilai maksimal tidak boleh kosong";
    } else if (isNaN(maksimal_stok)) {
      errors.maksimal_stok = "Nilai maksimal harus berupa angka";
    } else if (Number(maksimal_stok) < 0) {
      errors.maksimal_stok = "Nilai maksimal tidak boleh kurang dari 0";
    }

    if (
      !isNaN(minimal_stok) &&
      !isNaN(maksimal_stok) &&
      Number(minimal_stok) > Number(maksimal_stok)
    ) {
      errors.maksimal_stok =
        "Maksimal stok tidak boleh lebih kecil dari minimal stok";
    }
    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400
      );
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
