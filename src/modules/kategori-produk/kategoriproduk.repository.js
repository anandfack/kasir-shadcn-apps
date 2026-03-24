import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

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
  const baseSlug = generateSlug(data.nama_kategori);
  const slug = await generateUniqueSlug("kategori", baseSlug);

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
      slug,
    },
  });
}

export async function updateKategoriProdukRepo(id, data) {
  const existing = await prisma.kategori.findUnique({
    where: { id },
  });

  let slug = existing.slug;

  if (data.nama_kategori && data.nama_kategori !== existing.nama_kategori) {
    const baseSlug = generateSlug(data.nama_kategori);
    slug = await generateUniqueSlug("kategori", baseSlug);
  }

  return prisma.kategori.update({
    where: { id: parseInt(id) },
    data: {
      kode_kategori: data.kode_kategori,
      nama_kategori: data.nama_kategori,
      slug,
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
