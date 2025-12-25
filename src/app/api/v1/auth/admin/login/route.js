import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password harus diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.loginPemakai.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Username tidak ditemukan" },
        { status: 400 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Anda bukan admin." },
        { status: 403 }
      );
    }

    if (!user.is_aktif) {
      return NextResponse.json({ error: "Akun tidak aktif." }, { status: 403 });
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "Email belum diverifikasi." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Password salah" }, { status: 400 });
    }

    await prisma.loginPemakai.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        pegawai_id: user.pegawai_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Login admin berhasil." });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login Admin Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
