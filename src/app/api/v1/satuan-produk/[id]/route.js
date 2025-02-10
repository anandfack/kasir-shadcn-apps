import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { kode_satuan, nama_satuan } = body;

    if (!kode_satuan && !nama_satuan) {
      return new Response(
        JSON.stringify({
          error: "kode dan nama satuan produk harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!kode_satuan) {
      return new Response(
        JSON.stringify({
          error: "kode satuan produk harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!nama_satuan) {
      return new Response(
        JSON.stringify({
          error: "nama satuan produk harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updateSatuanProduk = await prisma.satuan.update({
      where: { id: parseInt(id) },
      data: {
        kode_satuan,
        nama_satuan,
        updated_at: new Date(),
      },
    });
    return new Response(JSON.stringify(updateSatuanProduk), {
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
    const deleteSatuanProduk = await prisma.satuan.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deleteSatuanProduk), {
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
