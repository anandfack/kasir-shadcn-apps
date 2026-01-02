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
    const { produk_id, harga_jual, harga_beli } = body;

    const errors = {};

    if (produk_id !== undefined) {
      if (!produk_id) {
        errors.produk_id = "Produk wajib diisi";
      } else if (isNaN(Number(produk_id))) {
        errors.produk_id = "Produk tidak valid";
      }
    }

    if (harga_jual !== undefined) {
      if (harga_jual === null || harga_jual === "") {
        errors.harga_jual = "Harga jual tidak boleh kosong";
      } else if (isNaN(Number(harga_jual))) {
        errors.harga_jual = "Harga jual harus berupa angka";
      } else if (Number(harga_jual) < 0) {
        errors.harga_jual = "Harga jual tidak boleh kurang dari 0";
      }
    }

    if (harga_beli !== undefined) {
      if (harga_beli === null || harga_beli === "") {
        errors.harga_beli = "Harga beli tidak boleh kosong";
      } else if (isNaN(Number(harga_beli))) {
        errors.harga_beli = "Harga beli harus berupa angka";
      } else if (Number(harga_beli) < 0) {
        errors.harga_beli = "Harga beli tidak boleh kurang dari 0";
      }
    }

    if (
      harga_jual !== undefined &&
      harga_beli !== undefined &&
      !errors.harga_jual &&
      !errors.harga_beli &&
      Number(harga_jual) < Number(harga_beli)
    ) {
      errors.harga_jual = "Harga jual tidak boleh lebih kecil dari harga beli";
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

    const existing = await prisma.harga.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return jsonResponse({ message: "Data tidak ditemukan" }, 404);
    }

    const updateHargaProduk = await prisma.harga.update({
  where: { id: parseInt(id) },
  data: {
    ...(produk_id !== undefined && { produk_id }),
    ...(harga_jual !== undefined && { harga_jual: Number(harga_jual) }),
    ...(harga_beli !== undefined && { harga_beli: Number(harga_beli) }),
  },
});
    return jsonResponse(
      {
        message: "Harga produk berhasil diperbarui",
        data: updateHargaProduk,
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

export const DELETE = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const deleteHargaProduk = await prisma.harga.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Harga produk berhasil dihapus",
        data: deleteHargaProduk,
      },
      201
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
