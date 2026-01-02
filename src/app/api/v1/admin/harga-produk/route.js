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

    const hargaProduk = await prisma.harga.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        produk_id: true,
        harga_jual: true,
        harga_beli: true,
        produk: {
          select: {
            id: true,
            nama_produk: true,
            kode_produk: true,
          },
        },
      },
    });
    console.log("Harga Produk List:", hargaProduk);
    return jsonResponse(
      {
        message: "OK",
        data: hargaProduk,
      },
      200
    );
  } catch (error) {
    console.error("Error :", error);
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
    const { produk_id, harga_jual, harga_beli } = body;

    const errors = {};

    if (!produk_id) {
      errors.produk_id = "Produk wajib diisi";
    } else if (isNaN(Number(produk_id))) {
      errors.produk_id = "Produk tidak valid";
    }

    if (harga_jual === undefined || harga_jual === null || harga_jual === "") {
      errors.harga_jual = "Harga jual wajib diisi";
    } else if (isNaN(Number(harga_jual))) {
      errors.harga_jual = "Harga jual harus berupa angka";
    } else if (Number(harga_jual) < 0) {
      errors.harga_jual = "Harga jual tidak boleh kurang dari 0";
    }

    if (harga_beli === undefined || harga_beli === null || harga_beli === "") {
      errors.harga_beli = "Harga beli wajib diisi";
    } else if (isNaN(Number(harga_beli))) {
      errors.harga_beli = "Harga beli harus berupa angka";
    } else if (Number(harga_beli) < 0) {
      errors.harga_beli = "Harga beli tidak boleh kurang dari 0";
    }

    if (
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

    const tambahHargaProduk = await prisma.harga.create({
      data: {
        produk_id,
        harga_jual,
        harga_beli,
      },
    });

    return jsonResponse(
      {
        message: "Harga produk berhasil ditambahkan",
        data: tambahHargaProduk,
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
