import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import jsonResponse from "@/lib/jsonResponse";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const errors = {};

    if (!username || username.trim() === "") {
      errors.username = "Username/Email wajib diisi";
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

    const user = await prisma.loginPemakai.findFirst({
      where: {
        OR: [
          { username },
          { email: username },
        ],
      },
    });

    if (!user) {
      return jsonResponse(
        {
          message: "Username/Email tidak ditemukan",
        },
        400
      );
    }

    const userRoles = await prisma.userRole.findMany({
      where: { loginpemakai_id: user.id },
    });

    if (userRoles.length === 0) {
      return jsonResponse(
        {
          message: "Akses ditolak, anda tidak memiliki role",
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

    const token = await new SignJWT({
      id: user.id,
      pegawai_id: user.pegawai_id,
      role_ids: userRoles.map(ur => ur.role_id),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    const response = NextResponse.json({ message: "Login admin berhasil." });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("token", token, {
      httpOnly: true,
      // secure: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
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
