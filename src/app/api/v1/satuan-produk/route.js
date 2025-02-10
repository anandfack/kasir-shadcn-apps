import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const satuanProduk = await prisma.satuan.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_satuan: "asc",
      },
    });
    return new Response(JSON.stringify(satuanProduk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { kode_satuan, nama_satuan, created_at, updated_at } = body;

    if (!kode_satuan && !nama_satuan) {
      return new Response(
        JSON.stringify({
          error: "kode satuan dan nama satuan harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!kode_satuan) {
      return new Response(
        JSON.stringify({
          error: "kode satuan harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!nama_satuan) {
      return new Response(
        JSON.stringify({
          error: "nama satuan harus diisi",
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

    const tambahSatuanProduk = await prisma.satuan.create({
      data: {
        kode_satuan,
        nama_satuan,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return new Response(JSON.stringify(tambahSatuanProduk), {
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
