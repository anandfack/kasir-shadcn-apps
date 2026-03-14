import { prisma } from "@/lib/prisma";

export async function getKategoriProdukRepo() {
  return prisma.kategori.findMany({
    select: {
      id: true,
      kode_kategori: true,
      nama_kategori: true,
    },
    where: {
      deleted_at: null,
    },
    orderBy: {
      nama_kategori: "asc",
    },
  });
}

export async function createKategoriProdukRepo(data) {
  const existingKodeKategori = await prisma.kategori.findFirst({
    where: {
      kode_kategori: data.kode_kategori,
      deleted_at: null,
    },
  });

  if (existingKodeKategori) {
    return jsonResponse(
      {
        message: "Kode Kategori sudah digunakan",
      },
      409,
    );
  }

  return prisma.kategori.create({
    data: {
      kode_kategori: data.kode_kategori,
      nama_kategori: data.nama_kategori,
    },
  });
}

export async function updateKategoriProdukRepo(id, data) {
  return prisma.kategori.update({
    where: { id: parseInt(id) },
    data: {
      kode_kategori: data.kode_kategori,
      nama_kategori: data.nama_kategori,
    },
  });
}

export async function deleteKategoriProdukRepo(id) {
  return prisma.kategori.update({
    where: { id: parseInt(id) },
    data: {
      deleted_at: new Date(),
    },
  });
}
