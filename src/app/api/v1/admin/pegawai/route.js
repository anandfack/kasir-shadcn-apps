import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    // =========================
    // 1. Ambil token dari cookie
    // =========================
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token tidak ditemukan" },
        { status: 401 }
      );
    }

    // =========================
    // 2. Verifikasi JWT
    // =========================
    const { payload } = await jwtVerify(token, SECRET);

    if (payload.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Bukan admin" },
        { status: 403 }
      );
    }

    // =========================
    // 3. Logic API (AMAN)
    // =========================
    const pegawai = await prisma.pegawai.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_pegawai: "asc",
      },
    });

    return NextResponse.json(pegawai, { status: 200 });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { message: "Invalid atau expired token" },
      { status: 401 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nip_pegawai,
      nama_pegawai,
      tanggal_lahir,
      jenis_kelamin,
      alamat_pegawai,
      nomor_telepon_pegawai,
      email_pegawai,
      jabatan_pegawai,
      is_aktif,
      created_at,
      updated_at,
    } = body;

    const requiredFields = [
      { key: "nip_pegawai", label: "NIP pegawai" },
      { key: "nama_pegawai", label: "Nama pegawai" },
      { key: "tanggal_lahir", label: "Tanggal lahir" },
      { key: "jenis_kelamin", label: "Jenis kelamin" },
      { key: "alamat_pegawai", label: "Alamat pegawai" },
      { key: "nomor_telepon_pegawai", label: "Nomor telepon pegawai" },
      { key: "email_pegawai", label: "Email pegawai" },
      { key: "jabatan_pegawai", label: "Jabatan pegawai" },
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
    const newPegawai = await prisma.pegawai.create({
      data: {
        nip_pegawai,
        nama_pegawai,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : nowJakarta,
        jenis_kelamin,
        alamat_pegawai,
        nomor_telepon_pegawai,
        email_pegawai,
        jabatan_pegawai,
        is_aktif: is_aktif ? is_aktif : true,
        created_at: created_at ? new Date(created_at) : nowJakarta,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return new Response(JSON.stringify(newPegawai), {
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
