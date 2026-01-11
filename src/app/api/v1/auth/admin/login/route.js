import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jsonResponse from "@/lib/jsonResponse";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const errors = {};

    if (!username || username.trim() === "") {
      errors.username = "Username wajib diisi";
    }

    if (password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    } else if (password.length > 20) {
      errors.password = "Password maksimal 20 karakter";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400
      );
    }

    const user = await prisma.loginPemakai.findUnique({
      where: { username },
    });

    if (!user) {
      jsonResponse(
        {
          message: "Username tidak ditemukan",
        },
        400
      );
    }

    if (user.role !== "superadmin") {
      return jsonResponse(
        {
          message: "Akses ditolak, anda bukan admin",
        },
        403
      );
    }

    if (!user.is_aktif || user.is_aktif == false) {
      return jsonResponse(
        {
          message: "Akun tidak aktif",
        },
        403
      );
    }

    if (!user.verified) {
      return jsonResponse(
        {
          message: "Akun belum diverifikasi",
        },
        403
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return jsonResponse(
        {
          message: "Password salah",
        },
        400
      );
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
    console.error("Internal Server Error", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
