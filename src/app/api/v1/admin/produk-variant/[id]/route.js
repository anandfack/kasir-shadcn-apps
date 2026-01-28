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
    const { sku, ukuran, warna, is_aktif } = body;

    // validasi form input
    const errors = {};
    if (!sku || sku.trim() === "") {
      errors.sku = "Kode supplier wajib diisi";
    }
    if (!ukuran || ukuran.trim() === "") {
      errors.ukuran = "Nama supplier wajib diisi";
    }
    if (!warna || warna.trim() === "") {
      errors.warna = "Alamat supplier wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        409,
      );
    }

    const updateProdukVariant = await prisma.produkVariant.update({
      where: { id: parseInt(id) },
      data: {
        sku,
        ukuran,
        warna,
        is_aktif,
      },
    });
    return jsonResponse(
      {
        message: "Data produk variant berhasil diperbarui",
        data: updateProdukVariant,
      },
      201,
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
};

export const DELETE = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const deleteProdukVariant = await prisma.produkVariant.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Produk variant dihapus",
        data: deleteProdukVariant,
      },
      201,
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
};
