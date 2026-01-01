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
    const { kode_kategori, nama_kategori } = body;

    // validasi form input
    const error = {};
    if (!kode_kategori || kode_kategori.trim() === "") {
      error.kode_kategori = "Kode kategori wajib diisi";
    }
    if (!nama_kategori || nama_kategori.trim() === "") {
      error.nama_kategori = "Nama kategori wajib diisi";
    }
    if (Object.keys(error).length > 0) {
      return new Response(
        JSON.stringify({ errors: error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
        400
      );
    }

    const updateKategoriProduk = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: {
        kode_kategori,
        nama_kategori,
      },
    });
    return jsonResponse(
      {
        message: "OK",
        data: updateKategoriProduk,
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

export const DELETE = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const deleteKategoriProduk = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Kategori produk berhasil dihapus",
        data: deleteKategoriProduk,
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
