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

    const supplier = await prisma.supplier.findMany({
      select: {
        id: true,
        kode_supplier: true,
        nama_supplier: true,
        alamat_supplier: true,
        nomor_telepon_supplier: true,
        is_aktif: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_supplier: "asc",
      },
    });
    return jsonResponse(
      {
        message: "OK",
        data: supplier,
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
      kode_supplier,
      nama_supplier,
      alamat_supplier,
      nomor_telepon_supplier,
      is_aktif,
    } = body;

    // validasi form input
    const errors = {};
    if (!kode_supplier || kode_supplier.trim() === "") {
      errors.kode_supplier = "Kode supplier wajib diisi";
    }
    if (!nama_supplier || nama_supplier.trim() === "") {
      errors.nama_supplier = "Nama supplier wajib diisi";
    }
    if (!alamat_supplier || alamat_supplier.trim() === "") {
      errors.alamat_supplier = "Alamat supplier wajib diisi";
    }
    if (nomor_telepon_supplier !== undefined) {
      const phone = nomor_telepon_supplier?.trim();

      if (!phone) {
        errors.nomor_telepon_supplier = "Nomor telepon tidak boleh kosong";
      } else if (!/^\d+$/.test(phone)) {
        errors.nomor_telepon_supplier =
          "Nomor telepon hanya boleh berisi angka";
      } else if (phone.length < 9 || phone.length > 15) {
        errors.nomor_telepon_supplier = "Panjang nomor telepon tidak valid";
      } else if (!/^(\+62|62|08)/.test(phone)) {
        errors.nomor_telepon_supplier =
          "Format nomor telepon Indonesia tidak valid";
      } else if (/^(\d)\1+$/.test(phone)) {
        errors.nomor_telepon_supplier = "Nomor telepon tidak valid";
      }
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

    // cek duplicate kode_supplier
    const existingKodeSupplier = await prisma.supplier.findFirst({
      where: {
        kode_supplier,
        deleted_at: null,
      },
    });

    if (existingKodeSupplier) {
      return jsonResponse(
        {
          message: "Kode supplier sudah digunakan",
        },
        409
      );
    }

    const tambahSupplier = await prisma.supplier.create({
      data: {
        kode_supplier,
        nama_supplier,
        alamat_supplier,
        nomor_telepon_supplier,
        is_aktif: is_aktif ? is_aktif : true,
      },
    });
    return jsonResponse(
      {
        message: "Supplier berhasil ditambahkan",
        data: tambahSupplier,
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
