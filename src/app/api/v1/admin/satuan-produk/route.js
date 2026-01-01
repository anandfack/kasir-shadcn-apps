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

    const satuanProduk = await prisma.satuan.findMany({
      select: {
        id: true,
        kode_satuan: true,
        nama_satuan: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_satuan: "asc",
      },
    });
    return jsonResponse(
      {
        message: "OK",
        data: satuanProduk,
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

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { kode_satuan, nama_satuan } = body;

    // validasi form input
    const errors = {};
    if (!kode_satuan || kode_satuan.trim() === "") {
      errors.kode_satuan = "Kode satuan wajib diisi";
    }
    if (!nama_satuan || nama_satuan.trim() === "") {
      errors.nama_satuan = "Nama satuan wajib diisi";
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

    // cek duplikasi kode_satuan
    const existingKodeSatuan = await prisma.satuan.findFirst({
      where: {
        kode_satuan,
        deleted_at: null,
      },
    });

    if (existingKodeSatuan) {
      return jsonResponse(
        {
          message: "Kode satuan sudah digunakan",
        },
        409
      );
    }

    const tambahSatuanProduk = await prisma.satuan.create({
      data: {
        kode_satuan,
        nama_satuan,
      },
    });

    return jsonResponse(
      {
        message: "Satuan produk berhasil ditambahkan",
        data: tambahSatuanProduk,
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
