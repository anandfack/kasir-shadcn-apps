import { prisma } from "@/lib/prisma";

export async function createGambarProdukRepo(produkId, urls) {
  return prisma.gambarProduk.createMany({
    data: urls.map((url) => ({
      produk_id: Number(produkId),
      url,
    })),
  });
}

export async function getProdukSlugById(id) {
  return prisma.produk.findUnique({
    where: { id },
    select: { slug: true },
  });
}
