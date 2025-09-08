import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { email, password, username } = await req.json();

  // simpan user dengan status belum terverifikasi
  const loginPemakai = await prisma.loginPemakai.create({
    data: {
      email,
      password,
      username,
      role: "KARYAWAN",
      is_aktif: true,
      verified: false,
    },
  });

  // generate token unik
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.emailVerification.create({
    data: {
      token,
      loginpemakai_id: loginPemakai.id,
      expired_at: new Date(Date.now() + 1000 * 60 * 60), // expired 1 jam
    },
  });

  // buat link verifikasi
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/verify-email?token=${token}`;
  // kirim email
  await resend.emails.send({
    from: "Kasir Apps <onboarding@resend.dev>", // bisa diganti domain kamu
    to: email,
    subject: "Verifikasi Email Kasir Apps",
    html: `<p>Halo,</p>
           <p>Klik link berikut untuk verifikasi email Anda:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>
           <p>Link ini berlaku selama 1 jam.</p>`,
  });

  return NextResponse.json({
    message: "Registrasi berhasil, cek email untuk verifikasi.",
  });
}
