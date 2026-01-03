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
    const {
      kategori_id,
      satuan_produk_id,
      supplier_id,
      kode_produk,
      nama_produk,
      deskripsi_produk,
      is_aktif,
    } = body;

    const errors = {};

    if (!satuan_produk_id) {
      errors.satuan_produk_id = "Satuan produk wajib diisi";
    } else if (isNaN(Number(satuan_produk_id))) {
      errors.satuan_produk_id = "Satuan produk tidak valid";
    }
    if (!kategori_id) {
      errors.kategori_id = "Kategori wajib diisi";
    } else if (isNaN(Number(kategori_id))) {
      errors.kategori_id = "Kategori tidak valid";
    }
    if (!supplier_id) {
      errors.supplier_id = "Supplier wajib diisi";
    } else if (isNaN(Number(supplier_id))) {
      errors.supplier_id = "Supplier tidak valid";
    }

    if (!kode_produk || kode_produk.trim() === "") {
      errors.kode_produk = "Kode produk wajib diisi";
    }
    if (!nama_produk || nama_produk.trim() === "") {
      errors.nama_produk = "Nama produk wajib diisi";
    }
    if (!deskripsi_produk || deskripsi_produk.trim() === "") {
      errors.deskripsi_produk = "Deskripsi produk wajib diisi";
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

    const updateProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        kategori_id,
        satuan_produk_id,
        supplier_id,
        kode_produk,
        nama_produk,
        deskripsi_produk,
        is_aktif,
      },
    });
    return jsonResponse(
      {
        message: "Produk berhasil diperbarui",
        data: updateProduk,
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
    const deleteProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Produk berhasil dihapus",
        data: deleteProduk,
      },
      200
    );
  } catch (error) {
    console.error("error:", error);
  }
};
