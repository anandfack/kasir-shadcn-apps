import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const { password, confirm_password } = await req.json();

    if (!password) {
      return Response.json({ error: "Password harus diisi" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return Response.json(
        { error: "Konfirmasi password tidak cocok" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nowJakarta = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });

    await prisma.loginPemakai.update({
      where: { id: Number(id) },
      data: {
        password: hashedPassword,
        updated_at: updated_at ? new Date(updated_at) : nowJakarta,
      },
    });

    return Response.json({
      message: "Password berhasil direset",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal reset password" }, { status: 500 });
  }
};
