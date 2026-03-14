import { prisma } from "@/lib/prisma";

export async function getSatuanProdukRepo() {
  return prisma.satuan.findMany({
    select: {
      id: true,
      kode_satuan: true,
      nama_satuan: true,
    },
    where: {
      deleted_at: null,
    },
    orderBy: {
      nama_satuan: "asc",
    },
  });
}

export async function createSatuanProdukRepo(data) {
  const existingKodeSatuan = await prisma.satuan.findFirst({
    where: {
      kode_satuan: data.kode_satuan,
      deleted_at: null,
    },
  });

  if (existingKodeSatuan) {
    return jsonResponse(
      {
        message: "Kode satuan sudah digunakan",
      },
      409,
    );
  }

  return prisma.satuan.create({
    data: {
      kode_satuan: data.kode_satuan,
      nama_satuan: data.kode_satuan,
    },
  });
}

export async function updateSatuanProdukRepo(id, data) {
  return prisma.satuan.update({
    where: { id: parseInt(id) },
    data: {
      kode_satuan: data.kode_satuan,
      nama_satuan: data.nama_satuan,
    },
  });
}

export async function deleteSatuanProdukRepo(id) {
  return prisma.satuan.update({
    where: { id: parseInt(id) },
    data: {
      deleted_at: new Date(),
    },
  });
}
