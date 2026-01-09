import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { searchParams } = new URL(req.url);
    const withoutLogin = searchParams.get("without_login");

    let whereCondition = {
      deleted_at: null,
    };

    if (withoutLogin === "true") {
      whereCondition.LoginPemakai = {
        is: null,
      };
    }

    const pegawai = await prisma.pegawai.findMany({
      select: {
        id: true,
        nip_pegawai: true,
        nama_pegawai: true,
        tanggal_lahir: true,
        jenis_kelamin: true,
        alamat_pegawai: true,
        nomor_telepon_pegawai: true,
        email_pegawai: true,
        jabatan_pegawai: true,
        is_aktif: true,
      },
      where: whereCondition,
      orderBy: {
        nama_pegawai: "asc",
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: pegawai,
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
    } = body;

    const errors = {};
    if (!nip_pegawai || nip_pegawai.trim() === "") {
      errors.nip_pegawai = "NIP Pegawai wajib diisi";
    }
    if (!nama_pegawai || nama_pegawai.trim() === "") {
      errors.nama_pegawai = "Nama Pegawai wajib diisi";
    }
    if (!tanggal_lahir || tanggal_lahir.trim() === "") {
      errors.tanggal_lahir = "Tanggal Lahir wajib diisi";
    }
    if (!jenis_kelamin || jenis_kelamin.trim() === "") {
      errors.jenis_kelamin = "Jenis Kelamin wajib diisi";
    }
    if (!alamat_pegawai || alamat_pegawai.trim() === "") {
      errors.alamat_pegawai = "Alamat Pegawai wajib diisi";
    }
    if (nomor_telepon_pegawai !== undefined) {
      const phone = nomor_telepon_pegawai?.trim();

      if (!phone) {
        errors.nomor_telepon_pegawai = "Nomor telepon tidak boleh kosong";
      } else if (!/^\d+$/.test(phone)) {
        errors.nomor_telepon_pegawai = "Nomor telepon hanya boleh berisi angka";
      } else if (phone.length < 9 || phone.length > 15) {
        errors.nomor_telepon_pegawai = "Panjang nomor telepon tidak valid";
      } else if (!/^(\+62|62|08)/.test(phone)) {
        errors.nomor_telepon_pegawai =
          "Format nomor telepon Indonesia tidak valid";
      } else if (/^(\d)\1+$/.test(phone)) {
        errors.nomor_telepon_pegawai = "Nomor telepon tidak valid";
      }
    }
    if (!email_pegawai || email_pegawai.trim() === "") {
      errors.email_pegawai = "Email Pegawai wajib diisi";
    }
    if (!jabatan_pegawai || jabatan_pegawai.trim() === "") {
      errors.jabatan_pegawai = "Jabatan Pegawai wajib diisi";
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
      },
    });

    return jsonResponse(
      {
        message: "Pegawai berhasil ditambahkan",
        data: newPegawai,
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
