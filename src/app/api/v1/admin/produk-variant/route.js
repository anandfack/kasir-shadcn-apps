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

    const produkVariant = await prisma.produkVariant.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        produk: {
          nama_produk: "asc",
        },
      },
      select: {
        id: true,
        produk: {
          select: {
            id: true,
            kode_produk: true,
            nama_produk: true,
          },
        },
        sku: true,
        ukuran: true,
        warna: true,
        is_aktif: true,
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: produkVariant,
      },
      200,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Eror",
      },
      500,
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
    const { produk_id, variants } = body;

    const errors = {};

    if (!produk_id) {
      errors.produk_id = "Produk wajib diisi";
    } else if (isNaN(Number(produk_id))) {
      errors.produk_id = "Produk tidak valid";
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      errors.variants = "Variant minimal 1";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 422);
    }

    const result = await prisma.$transaction(async (tx) => {
      const produk = await tx.produk.findUnique({
        where: { id: Number(produk_id) },
        include: {
          produkVariants: true,
        },
      });

      if (!produk) {
        throw new Error("Produk tidak ditemukan");
      }

      const createdVariants = await Promise.all(
        variants.map((variant) =>
          tx.produkVariant.create({
            data: {
              produk_id: Number(produk_id),
              sku: variant.sku,
              ukuran: variant.ukuran,
              warna: variant.warna,
            },
          }),
        ),
      );

      return {
        produk_id,
        variants: createdVariants,
      };
    });

    return jsonResponse(
      {
        message: "Produk variant berhasil ditambahkan",
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error:", error);

    return jsonResponse(
      {
        message: error.message || "Internal Server Error",
      },
      500,
    );
  }
}
