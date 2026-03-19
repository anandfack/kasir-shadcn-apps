import { prisma } from "@/lib/prisma";

export async function getStokVariantRepo() {
  return prisma.produkVariant.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      produk: {
        select: {
          id: true,
          nama_produk: true,
        },
      },
      stok: true,
    },
    orderBy: {
      produk: {
        nama_produk: "asc",
      },
    },
  });
}

export async function updateStokVariantRepo(id, data) {
  return prisma.stokVariant.upsert({
    where: {
      produk_variant_id: parseInt(id, 10),
    },
    update: {
      minimal_stok: Number(data.minimal_stok),
      maksimal_stok: Number(data.maksimal_stok),
    },
    create: {
      produk_variant_id: parseInt(id, 10),
      jumlah_stok: 0,
      minimal_stok: Number(data.minimal_stok),
      maksimal_stok: Number(data.maksimal_stok),
    },
  });
}

export async function adjustStokVariantRepo(data, auth) {
  const stokVariant = await prisma.stokVariant.findUnique({
    where: {
      produk_variant_id: data.produk_variant_id,
    },
  });

  if (!stokVariant) {
    return jsonResponse(
      {
        message: "Data stok variant tidak ditemukan",
      },
      404,
    );
  }

  const stokSistem = stokVariant.jumlah_stok;
  const stokFisik = Number(data.stok_fisik);
  const selisih = stokFisik - stokSistem;

  if (selisih === 0) {
    return jsonResponse(
      {
        message: "Tidak ada selisih stok",
      },
      400,
    );
  }

  return prisma.$transaction(async (tx) => {
    const mutasi = await tx.mutasiStokVariant.create({
      data: {
        produk_variant_id: data.produk_variant_id,
        tipe_mutasi: "PENYESUAIAN",
        jumlah_mutasi: Math.abs(selisih),
        keterangan_mutasi: data.keterangan_mutasi,
        pegawai_id: auth.user?.pegawai_id,
        tanggal_mutasi: new Date(),
        nomor_mutasi: `MT-VAR-${Date.now()}`,
      },
    });

    const stokUpdate = await tx.stokVariant.update({
      where: {
        produk_variant_id: data.produk_variant_id,
      },
      data: {
        jumlah_stok: stokFisik,
        updated_at: new Date(),
      },
    });

    return {
      mutasi,
      stok: stokUpdate,
      selisih,
      stok_sistem: stokSistem,
      stok_fisik: stokFisik,
    };
  });
}
