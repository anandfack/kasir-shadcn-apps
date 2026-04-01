import { prisma } from "@/lib/prisma";

export async function getDashboardRepo() {
  const ourProducts = await prisma.produk.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      kode_produk: true,
      nama_produk: true,
      slug: true,
      gambarProduks: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    take: 6,
  });

  const featuredProducts = await prisma.produk.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      kode_produk: true,
      nama_produk: true,
      deskripsi_produk: true,
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
      slug: true,
      gambarProduks: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    take: 3,
  });

  const signaturePieces = await prisma.produk.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      kode_produk: true,
      nama_produk: true,
      slug: true,
      gambarProduks: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    take: 3,
  });

  return {
    ourProducts,
    signaturePieces,
    featuredProducts,
  };
}
