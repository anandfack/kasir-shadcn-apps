import jsonResponse from "@/lib/jsonResponse";
import { prisma } from "@/lib/prisma";

export async function getSupplierRepo() {
  return prisma.supplier.findMany({
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
}

export async function createSupplierRepo(data) {
  const existingKodeSupplier = await prisma.supplier.findFirst({
    where: {
      kode_supplier: data.kode_supplier,
      deleted_at: null,
    },
  });

  if (existingKodeSupplier) {
    return jsonResponse(
      {
        message: "Kode supplier sudah digunakan",
      },
      409,
    );
  }

  return prisma.supplier.create({
    data: {
      kode_supplier: data.kode_supplier,
      nama_supplier: data.nama_supplier,
      alamat_supplier: data.alamat_supplier,
      nomor_telepon_supplier: data.nomor_telepon_supplier,
      is_aktif: data.is_aktif ? data.is_aktif : true,
    },
  });
}

export async function updateSupplierRepo(id, data) {
  return prisma.supplier.update({
    where: { id: parseInt(id) },
    data: {
      kode_supplier: data.kode_supplier,
      nama_supplier: data.nama_supplier,
      alamat_supplier: data.alamat_supplier,
      nomor_telepon_supplier: data.nomor_telepon_supplier,
      is_aktif: data.is_aktif,
    },
  });
}

export async function deleteSupplierRepo(id) {
  return prisma.supplier.update({
    where: { id: parseInt(id) },
    data: { deleted_at: new Date() },
  });
}
