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
    const { kode_satuan, nama_satuan } = body;

    // validasi form input
    const error = {};
    if (!kode_satuan || kode_satuan.trim() === "") {
      error.kode_satuan = "Kode satuan wajib diisi";
    }
    if (!nama_satuan || nama_satuan.trim() === "") {
      error.nama_satuan = "Nama satuan wajib diisi";
    }

    if (Object.keys(error).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
        },
        400
      );
    }

    const updateSatuanProduk = await prisma.satuan.update({
      where: { id: parseInt(id) },
      data: {
        kode_satuan,
        nama_satuan,
      },
    });
    return jsonResponse(
      {
        message: "OK",
        data: updateSatuanProduk,
      },
      201
    );
  } catch (error) {
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
    const deleteSatuanProduk = await prisma.satuan.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Satuan produk berhasil dihapus",
        data: deleteSatuanProduk,
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
