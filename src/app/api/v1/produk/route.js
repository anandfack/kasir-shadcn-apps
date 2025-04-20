import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const withoutPrice = searchParams.get("without_price");

    let whereCondition = {
      deleted_at: null,
    };

    if (withoutPrice === "true") {
      whereCondition.Harga = {
        // Produk tidak memiliki harga sama sekali,
        // atau hanya punya harga yang semuanya sudah dihapus
        none: {
          deleted_at: null,
        },
      };
    }
    
    const produk = await prisma.produk.findMany({
      where: whereCondition,
      orderBy: {
        nama_produk: "asc",
      },
      include: {
        kategori: true,
        satuan: true,
        supplier: true,
      },
    });

    return new Response(JSON.stringify(produk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error); // Tambahkan ini untuk melihat error di log
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      kategori_id,
      satuan_produk_id,
      supplier_id,
      kode_produk,
      nama_produk,
      deskripsi_produk,
      is_aktif,
      created_at,
      updated_at,
    } = body;

    if (
      !kategori_id &&
      !satuan_produk_id &&
      !supplier_id &&
      !kode_produk &&
      !nama_produk &&
      !deskripsi_produk
    ) {
      return new Response(
        JSON.stringify({
          error: "semua kolom harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const nowJakarta = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });

    const tambahProduk = await prisma.produk.create({
      data: {
        kategori_id,
        satuan_produk_id,
        supplier_id,
        kode_produk,
        nama_produk,
        deskripsi_produk,
        is_aktif: is_aktif ? is_aktif : true,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return new Response(JSON.stringify(tambahProduk), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
