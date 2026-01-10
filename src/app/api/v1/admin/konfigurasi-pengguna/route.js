import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const konfigurasiPengguna = await prisma.loginPemakai.findMany({
      where: { deleted_at: null },
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

    return jsonResponse(
      {
        message: "OK",
        data: konfigurasiPengguna,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { pegawai_id, username, email, password, role, verified, is_aktif } =
      body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const errors = {};

    if (!pegawai_id) {
      errors.pegawai_id = "Pegawai wajib diisi";
    } else if (isNaN(Number(pegawai_id))) {
      errors.pegawai_id = "Pegawai tidak valid";
    }

    if (!username || username.trim() === "") {
      errors.username = "Username wajib diisi";
    }
    if (!password || password.trim() === "") {
      errors.password = "Password wajib diisi";
    }
    if (password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    } else if (password.length > 20) {
      errors.password = "Password maksimal 20 karakter";
    }
    if (!/[A-Z]/.test(password)) {
      errors.password = "Password harus mengandung setidaknya 1 huruf besar";
    }
    if (!/[a-z]/.test(password)) {
      errors.password = "Password harus mengandung setidaknya 1 huruf kecil";
    }
    if (!/\d/.test(password)) {
      errors.password = "Password harus mengandung setidaknya 1 angka";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = "Password harus mengandung setidaknya 1 simbol khusus";
    }
    if (/\s/.test(password)) {
      errors.password = "Password tidak boleh mengandung spasi";
    }

    if (!role || role.trim() === "") {
      errors.role = "Role wajib diisi";
    }
    if (!email || email.trim() === "") {
      errors.email = "Email wajib diisi";
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

    const tambahKonfigurasiPengguna = await prisma.loginPemakai.create({
      data: {
        pegawai_id,
        username,
        email,
        password: hashedPassword,
        role,
        verified: verified ? verified : true,
        is_aktif: is_aktif ? is_aktif : true,
      },
    });

    return jsonResponse(
      {
        message: "Konfigurasi pengguna berhasil ditambahkan!",
        data: tambahKonfigurasiPengguna,
      },
      201
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
