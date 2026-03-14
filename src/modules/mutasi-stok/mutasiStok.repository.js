import { prisma } from "@/lib/prisma";

export async function mutasiStokRepo(produkId) {
  return prisma.mutasiStok.findMany({
    where: {
      id: produkId,
      deleted_at: null,
    },
    orderBy: {
      tanggal_mutasi: "desc",
    },

    select: {
      id: true,
      produk_id: true,
      nomor_mutasi: true,
      tanggal_mutasi: true,
      tipe_mutasi: true,
      jumlah_mutasi: true,
      keterangan_mutasi: true,
      produk: {
        select: {
          id: true,
          nama_produk: true,
          kode_produk: true,
          satuan: {
            select: {
              id: true,
              nama_satuan: true,
            },
          },
        },
      },
    },
  });
}
