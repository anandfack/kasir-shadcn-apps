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
        409
      );
    }

    const updateSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        kode_supplier,
        nama_supplier,
        alamat_supplier,
        nomor_telepon_supplier,
        is_aktif,
      },
    });
    return jsonResponse(
      {
        message: "Data supplier berhasil diperbarui",
        data: updateSupplier,
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
};

export const DELETE = async (req, { params }) => {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const deleteSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return jsonResponse(
      {
        message: "Supplier berhasil dihapus",
        data: deleteSupplier,
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
};
