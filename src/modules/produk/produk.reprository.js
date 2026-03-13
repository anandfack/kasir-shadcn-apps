import { prisma } from "@/lib/prisma";

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
  return prisma.produk.create({
    data: {
      kategori_id: Number(data.kategori_id),
      satuan_produk_id: Number(data.satuan_produk_id),
      supplier_id: Number(data.supplier_id),
      kode_produk: data.kode_produk,
      nama_produk: data.nama_produk,
      deskripsi_produk: data.deskripsi_produk,
      is_aktif: data.is_aktif ?? true,
    },
  });
}