import { prisma } from "@/lib/prisma";

export async function mutasiStokVariantRepo(produkVariantId) {
  return prisma.mutasiStokVariant.findMany({
    where: {
      produk_variant_id: produkVariantId,
      deleted_at: null,
    },
    orderBy: {
      tanggal_mutasi: "desc",
    },
    select: {
      id: true,
      produk_variant_id: true,
      nomor_mutasi: true,
      tanggal_mutasi: true,
      tipe_mutasi: true,
      jumlah_mutasi: true,
      keterangan_mutasi: true,
      produkVariant: {
        select: {
          id: true,
          warna: true,
          ukuran: true,
          sku: true,
          satuan: {
            select: {
              id: true,
              nama_satuan: true,
              kode_satuan: true,
            },
          },
          produk: {
            select: {
              id: true,
              nama_produk: true,
              kode_produk: true,
            },
          },
        },
      },
    },
  });
}
