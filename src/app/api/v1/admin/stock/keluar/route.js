import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

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
      return jsonResponse(
        {
          message: "Satuan tidak ditemukan",
        },
        400
      );
    }

    // Cek stok saat ini
    const stok = await prisma.stok.findUnique({
      where: { produk_id },
    });

    if (!stok || stok.jumlah_stok < jumlah) {
      return jsonResponse(
        {
          message: "Stock tidak mencukupi",
        },
        400
      );
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
      },
    });

    return jsonResponse(
      {
        message: "Stock keluar berhasil ditambahkan",
      },
      201
    );
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
