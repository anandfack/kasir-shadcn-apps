import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const body = await req.json();
    const { pegawai_id, username, email, role, is_aktif } = body;

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

    const updateKonfigurasiPengguna = await prisma.loginPemakai.update({
      where: { id: parseInt(id) },
      data: {
        pegawai_id,
        username,
        email,
        role,
        is_aktif,
      },
    });
    return jsonResponse(
      {
        message: "Berhasil update konfigurasi pengguna",
        data: updateKonfigurasiPengguna,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const deletePengguna = await prisma.loginPemakai.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Berhasil menghapus konfigurarsi pengguna",
        data: deletePengguna,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
};
