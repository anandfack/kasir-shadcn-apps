import { prisma } from "@/lib/prisma";

export async function createGambarProdukRepo(produkId, urls) {
  return prisma.gambarProduk.createMany({
    data: urls.map((url) => ({
      produk_id: Number(produkId),
      url,
    })),
  });
}
