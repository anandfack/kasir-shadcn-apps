import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      produk_id,
      jumlah,
      satuan_produk_id,
      keterangan_mutasi,
      pegawai_id,
      tanggal_kadaluarsa,
      tanggal_mutasi,
      nomor_mutasi,
    } = body;

    // Cek satuan
    const satuan = await prisma.satuan.findUnique({
      where: { id: satuan_produk_id },
    });

    if (!satuan) {
      return Response.json(
        { error: "Satuan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek stok saat ini
    const stok = await prisma.stok.findUnique({
      where: { produk_id },
    });

    if (!stok || stok.jumlah_stok < jumlah) {
      return Response.json({ error: "Stok tidak mencukupi" }, { status: 400 });
    }

    // Tambahkan mutasi stok keluar
    await prisma.mutasiStok.create({
      data: {
        jumlah_mutasi: jumlah,
        tipe_mutasi: "keluar",
        keterangan_mutasi,
        tanggal_kadaluarsa: tanggal_kadaluarsa
          ? new Date(tanggal_kadaluarsa)
          : null,
        tanggal_mutasi: new Date(tanggal_mutasi),
        nomor_mutasi,
        produk: { connect: { id: produk_id } },
        pegawai: { connect: { id: pegawai_id } },
        satuan_produk: { connect: { id: satuan_produk_id } },
      },
    });

    // Update stok (kurangi jumlah)
    await prisma.stok.update({
      where: { produk_id },
      data: {
        jumlah_stok: {
          decrement: jumlah,
        },
        updated_at: new Date(),
      },
    });

    return Response.json({ message: "Stok keluar berhasil" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
