import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Ambil token dari query string
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token tidak ada" }, { status: 400 });
    }

    // Cari token di database
    const record = await prisma.emailVerification.findUnique({
      where: { token },
      include: { loginPemakai: true },
    });

    if (!record) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    // Cek expired
    if (record.expired_at < new Date()) {
      return NextResponse.json(
        { error: "Token sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Update status user jadi verified
    await prisma.loginPemakai.update({
      where: { id: record.loginpemakai_id },
      data: { verified: true },
    });

    // Hapus token setelah dipakai (opsional)
    await prisma.emailVerification.delete({ where: { id: record.id } });

    // return NextResponse.json({ message: "Email berhasil diverifikasi!" });
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?status=success`
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// export async function GET(req) {
//   try {
//     // Ambil token dari query string
//     const { searchParams } = new URL(req.url);
//     const token = searchParams.get("token");

//     if (!token) {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=TokenTidakAda`
//       );
//     }

//     // Cari token di database
//     const record = await prisma.emailVerification.findUnique({
//       where: { token },
//       include: { loginPemakai: true },
//     });

//     if (!record) {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=TokenTidakValid`
//       );
//     }

//     // Cek expired
//     if (record.expired_at < new Date()) {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=TokenExpired`
//       );
//     }

//     // Update status user jadi verified
//     await prisma.loginPemakai.update({
//       where: { id: record.loginpemakai_id },
//       data: { verified: true },
//     });

//     // Hapus token setelah dipakai (opsional)
//     await prisma.emailVerification.delete({ where: { id: record.id } });

//     // 🔥 Redirect sukses ke halaman UI
//     return NextResponse.redirect(
//       `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
//     );
//   } catch (error) {
//     console.error("Verify error:", error);

//     return NextResponse.redirect(
//       `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=ServerError`
//     );
//   }
// }

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body request harus JSON" },
      { status: 400 }
    );
  }

  const { token } = body || {};
  if (!token) {
    return NextResponse.json({ error: "Token tidak ada" }, { status: 400 });
  }

  const record = await prisma.emailVerification.findUnique({
    where: { token },
    include: { loginPemakai: true },
  });

  if (!record || record.expired_at < new Date()) {
    return NextResponse.json(
      { error: "Token tidak valid atau sudah kadaluarsa" },
      { status: 400 }
    );
  }

  await prisma.loginPemakai.update({
    where: { id: record.loginpemakai_id },
    data: { verified: true },
  });

  await prisma.emailVerification.delete({ where: { id: record.id } });

  return alert("Email berhasil diverifikasi!");
}
