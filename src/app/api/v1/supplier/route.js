import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const supplier = await prisma.supplier.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_supplier: "asc",
      },
    });
    return new Response(JSON.stringify(supplier), {
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
    const {
      kode_supplier,
      nama_supplier,
      alamat_supplier,
      nomor_telepon_supplier,
      is_aktif,
      created_at,
      updated_at,
    } = body;

    if (
      !kode_supplier &&
      !nama_supplier &&
      !alamat_supplier &&
      !nomor_telepon_supplier
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

    const tambahSupplier = await prisma.supplier.create({
      data: {
        kode_supplier,
        nama_supplier,
        alamat_supplier,
        nomor_telepon_supplier,
        is_aktif: is_aktif ? is_aktif : true,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return new Response(JSON.stringify(tambahSupplier), {
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
