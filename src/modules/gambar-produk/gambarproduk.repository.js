import { prisma } from "@/lib/prisma";

export async function getGambarProdukRepo(produkId) {
  return prisma.gambarProduk.findMany({
    where: {
      produk_id: produkId,
    },
    select: {
      id: true,
      url: true,
    },
  });
}
