import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
    const { password, confirm_password } = await req.json();

    const errors = {};

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

    if (password !== confirm_password) {
      errors.confirm_password = "Password tidak cocok";
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.loginPemakai.update({
      where: { id: Number(id) },
      data: {
        password: hashedPassword,
      },
    });

    return jsonResponse(
      {
        message: "Password berhasil direset",
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
