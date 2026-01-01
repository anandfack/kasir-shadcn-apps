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
    const error = {};
    if (!kode_supplier || kode_supplier.trim() === "") {
      error.kode_supplier = "Kode supplier wajib diisi";
    }
    if (!nama_supplier || nama_supplier.trim() === "") {
      error.nama_supplier = "Nama supplier wajib diisi";
    }
    if (!alamat_supplier || alamat_supplier.trim() === "") {
      error.alamat_supplier = "Alamat supplier wajib diisi";
    }
    if (!nomor_telepon_supplier || nomor_telepon_supplier.trim() === "") {
      error.nomor_telepon_supplier = "Nomor telepon supplier wajib diisi";
    }

    if (Object.keys(error).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
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
