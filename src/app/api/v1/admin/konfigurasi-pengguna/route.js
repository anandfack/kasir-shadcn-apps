import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // const { searchParams } = new URL(req.url);

    const konfigurasiPengguna = await prisma.loginPemakai.findMany({
      select: {
        id: true,
        username: true,
        last_login: true,
        role: true,
        email: true,
        verified: true,
        is_aktif: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(konfigurasiPengguna), {
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
      pegawai_id,
      username,
      email,
      password,
      role,
      verified,
      is_aktif,
      created_at,
      updated_at,
    } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const requiredFields = [
      { key: "pegawai_id", label: "Pegawai" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "role", label: "Role" },
    ];

    const missingFields = requiredFields.filter((field) => !body[field.key]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `${missingFields[0].label} harus diisi`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const nowJakarta = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });

    const tambahKonfigurasiPengguna = await prisma.loginPemakai.create({
      data: {
        pegawai_id,
        username,
        email,
        password: hashedPassword,
        role,
        verified: verified ? verified : true,
        is_aktif: is_aktif ? is_aktif : true,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return new Response(JSON.stringify(tambahKonfigurasiPengguna), {
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
