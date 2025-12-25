import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      kode_supplier,
      nama_supplier,
      alamat_supplier,
      nomor_telepon_supplier,
      is_aktif,
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

    const updateSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        kode_supplier,
        nama_supplier,
        alamat_supplier,
        nomor_telepon_supplier,
        updated_at: new Date(),
        is_aktif,
      },
    });
    return new Response(JSON.stringify(updateSupplier), {
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
    const deleteSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deleteSupplier), {
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
