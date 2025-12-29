import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { pegawai_id, username, email, role, is_aktif } = body;

    if (!pegawai_id && !username && !email && !role) {
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

    const updateKonfigurasiProduk = await prisma.loginPemakai.update({
      where: { id: parseInt(id) },
      data: {
        pegawai_id,
        username,
        email,
        role,
        is_aktif,
        updated_at: new Date(),
      },
    });
    return new Response(JSON.stringify(updateKonfigurasiProduk), {
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
    const deletePengguna = await prisma.loginPemakai.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deletePengguna), {
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
