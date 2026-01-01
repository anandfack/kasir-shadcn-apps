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

    const data = await prisma.kategori.findMany({
      select: {
        id: true,
        kode_kategori: true,
        nama_kategori: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_kategori: "asc",
      },
    });
    return jsonResponse({
      message: "OK",
      data,
    });
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { kode_kategori, nama_kategori } = body;

    // validasi form input
    const errors = {};
    if (!kode_kategori || kode_kategori.trim() === "") {
      errors.kode_kategori = "Kode kategori wajib diisi";
    }
    if (!nama_kategori || nama_kategori.trim() === "") {
      errors.nama_kategori = "Nama kategori wajib diisi";
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

    // cek duplicate kode_kategori
    const existingKodeKategori = await prisma.kategori.findFirst({
      where: {
        kode_kategori,
        deleted_at: null,
      },
    });

    if (existingKodeKategori) {
      return jsonResponse(
        {
          message: "Kode Kategori already exists",
        },
        409
      );
    }

    // simpan kategori produk baru
    const newCategory = await prisma.kategori.create({
      data: {
        kode_kategori,
        nama_kategori,
      },
    });

    return jsonResponse(
      {
        message: "Kategori produk berhasil ditambahkan",
        data: newCategory,
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
}
