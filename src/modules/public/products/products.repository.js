import { prisma } from "@/lib/prisma";

export async function getDetailProductsRepo(slug) {
  return prisma.produk.findFirst({
    where: {
      slug,
      deleted_at: null,
    },
    select: {
      id: true,
      nama_produk: true,
      kode_produk: true,
      deskripsi_produk: true,
      produkVariants: {
        select: {
          id: true,
          sku: true,
          warna: true,
          ukuran: true,
        },
      },
      kategori: {
        select: {
          nama_kategori: true,
        },
      },
      Harga: {
        select: {
          harga_jual: true,
        },
      },
      gambarProduks: {
        select: {
          url: true,
        },
      },
    },
  });
}
