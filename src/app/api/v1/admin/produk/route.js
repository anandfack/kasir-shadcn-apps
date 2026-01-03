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

    const { searchParams } = new URL(req.url);
    const withoutPrice = searchParams.get("without_price");

    let whereCondition = {
      deleted_at: null,
    };

    if (withoutPrice === "true") {
      whereCondition.Harga = {
        none: {
          deleted_at: null,
        },
      };
    }

    const produk = await prisma.produk.findMany({
      select: {
        id: true,
        kode_produk: true,
        nama_produk: true,
        deskripsi_produk: true,
        is_aktif: true,
        kategori: {
          select: {
            id: true,
            kode_kategori: true,
            nama_kategori: true,
          },
        },
        satuan: {
          select: {
            id: true,
            kode_satuan: true,
            nama_satuan: true,
          },
        },
        supplier: {
          select: {
            id: true,
            kode_supplier: true,
            nama_supplier: true,
          },
        },
        Harga: {
          select: {
            id: true,
            harga_jual: true,
            harga_beli: true,
          },
        },
      },
      where: whereCondition,
      orderBy: {
        nama_produk: "asc",
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: produk,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Eror",
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

    const tambahProduk = await prisma.produk.create({
      data: {
        kategori_id,
        satuan_produk_id,
        supplier_id,
        kode_produk,
        nama_produk,
        deskripsi_produk,
        is_aktif: is_aktif ? is_aktif : true,
      },
    });

    return jsonResponse(
      {
        message: "Produk berhasil ditambahkan",
        data: tambahProduk,
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
