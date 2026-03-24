import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

export async function findProduk(whereCondition) {
  return prisma.produk.findMany({
    where: whereCondition,
    select: {
      id: true,
      kode_produk: true,
      nama_produk: true,
      deskripsi_produk: true,
      is_aktif: true,
      kategori: {
        select: {
          id: true,
          kode_kategori: true,
          nama_kategori: true,
        },
      },
      satuan: {
        select: {
          id: true,
          kode_satuan: true,
          nama_satuan: true,
        },
      },
      supplier: {
        select: {
          id: true,
          kode_supplier: true,
          nama_supplier: true,
        },
      },
      Harga: {
        select: {
          id: true,
          harga_jual: true,
          harga_beli: true,
        },
      },
    },
    orderBy: {
      nama_produk: "asc",
    },
  });
}

export async function createProdukRepo(data) {
  const baseSlug = generateSlug(data.nama_produk);
  const slug = await generateUniqueSlug("produk", baseSlug);
  return prisma.produk.create({
    data: {
      kategori_id: Number(data.kategori_id),
      satuan_produk_id: Number(data.satuan_produk_id),
      supplier_id: Number(data.supplier_id),
      kode_produk: data.kode_produk,
      nama_produk: data.nama_produk,
      slug,
      deskripsi_produk: data.deskripsi_produk,
      is_aktif: data.is_aktif ?? true,
    },
  });
}

export async function updateProdukRepo(id, data) {
  const existing = await prisma.produk.findUnique({
    where: { id },
  });

  let slug = existing.slug;

  if (data.nama_produk && data.nama_produk !== existing.nama_produk) {
    const baseSlug = generateSlug(data.nama_produk);
    slug = await generateUniqueSlug("produk", baseSlug);
  }
  return prisma.produk.update({
    where: { id },
    data: {
      kategori_id: Number(data.kategori_id),
      satuan_produk_id: Number(data.satuan_produk_id),
      supplier_id: Number(data.supplier_id),
      kode_produk: data.kode_produk,
      nama_produk: data.nama_produk,
      slug,
      deskripsi_produk: data.deskripsi_produk,
      is_aktif: data.is_aktif ?? true,
    },
  });
}

export async function deleteProdukRepo(id) {
  return prisma.produk.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });
}
