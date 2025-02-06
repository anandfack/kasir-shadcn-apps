import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const productsCategory = await prisma.kategori.findMany({
      where: {
        deleted_at: null,
      },
    });
    return new Response(JSON.stringify(productsCategory), {
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
    const { kode_kategori, nama_kategori, created_at, updated_at } = body;

    if (!kode_kategori && !nama_kategori) {
      return new Response(
        JSON.stringify({
          error: "kode kategori dan nama kategori harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!kode_kategori) {
      return new Response(
        JSON.stringify({
          error: "kode kategori harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!nama_kategori) {
      return new Response(
        JSON.stringify({
          error: "nama kategori harus diisi",
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
    const newCategory = await prisma.kategori.create({
      data: {
        kode_kategori,
        nama_kategori,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
        // created_at: created_at ? new Date(created_at) : new Date(),
        // updated_at: updated_at ? new Date(updated_at) : new Date(),
      },
    });

    return new Response(JSON.stringify(newCategory), {
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
