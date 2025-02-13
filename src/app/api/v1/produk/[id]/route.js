import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
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

    const updateProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        kategori_id,
        satuan_produk_id,
        supplier_id,
        kode_produk,
        nama_produk,
        deskripsi_produk,
        is_aktif,
        updated_at: new Date(),
      },
    });
    return new Response(JSON.stringify(updateProduk), {
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
    const deleteProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deleteProduk), {
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
