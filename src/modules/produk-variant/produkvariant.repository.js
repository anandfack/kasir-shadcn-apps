import { prisma } from "@/lib/prisma";

export async function produkVariantRepo() {
  return prisma.produkVariant.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      produk: {
        nama_produk: "asc",
      },
    },
    select: {
      id: true,
      produk: {
        select: {
          id: true,
          kode_produk: true,
          nama_produk: true,
          Harga: {
            select: {
              harga_jual: true,
              harga_beli: true,
            },
          },
        },
      },
      sku: true,
      ukuran: true,
      warna: true,
      is_aktif: true,
    },
  });
}

export async function createProdukVariantRepo(data) {
  return prisma.$transaction(async (tx) => {
    const produk = await tx.produk.findUnique({
      where: { id: Number(data.produk_id) },
    });

    if (!produk) {
      throw new Error("Produk tidak ditemukan");
    }

    const variantsData = data.variants.map((variant) => ({
      produk_id: Number(data.produk_id),
      sku: variant.sku,
      ukuran: variant.ukuran,
      warna: variant.warna,
    }));

    await tx.produkVariant.createMany({
      data: variantsData,
    });

    return {
      produk_id: data.produk_id,
      total_variant: variantsData.length,
    };
  });
}

export async function updateProdukVariantRepo(id, data) {
  return prisma.produkVariant.update({
    where: { id },
    data: {
      sku: data.sku,
      ukuran: data.ukuran,
      warna: data.warna,
      is_aktif: data.is_aktif ?? true,
    },
  });
}

export async function deleteProdukVariantRepo(id) {
  return prisma.produkVariant.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });
}
