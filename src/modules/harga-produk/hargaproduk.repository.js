import jsonResponse from "@/lib/jsonResponse";
import { prisma } from "@/lib/prisma";

export async function getHargaProdukRepo() {
  return prisma.harga.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      id: true,
      produk_id: true,
      harga_jual: true,
      harga_beli: true,
      produk: {
        select: {
          id: true,
          nama_produk: true,
          kode_produk: true,
        },
      },
    },
  });
}

export async function createHargaProdukRepo(data) {
  return prisma.harga.create({
    data: {
      produk_id: data.produk_id,
      harga_jual: data.harga_jual,
      harga_beli: data.harga_beli,
    },
  });
}

export async function updateHargaProdukRepo(id, data) {
  const existing = await prisma.harga.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existing) {
    throw new Error("Data tidak ditemukan");
  }

  return prisma.harga.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.produk_id !== undefined && { produk_id: data.produk_id }),
      ...(data.harga_jual !== undefined && {
        harga_jual: Number(data.harga_jual),
      }),
      ...(data.harga_beli !== undefined && {
        harga_beli: Number(data.harga_beli),
      }),
    },
  });
}

export async function deleteHargaProdukRepo(id) {
  return prisma.harga.update({
    where: { id: parseInt(id) },
    data: { deleted_at: new Date() },
  });
}
