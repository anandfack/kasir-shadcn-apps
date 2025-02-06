import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { kode_kategori, nama_kategori } = body;

    if (!kode_kategori && nama_kategori) {
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

    const updateKategoriProduk = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: {
        kode_kategori,
        nama_kategori,
        updated_at: new Date(), // Set waktu terbaru secara manual
      },
      // data: body,
    });
    return new Response(JSON.stringify(updateKategoriProduk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    const deleteKategoriProduk = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deleteKategoriProduk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
