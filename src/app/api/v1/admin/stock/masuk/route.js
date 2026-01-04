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

    // Cek apakah satuan ada (optional, bisa skip juga)
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

    // Tambahkan mutasi stok masuk
    await prisma.mutasiStok.create({
      data: {
        jumlah_mutasi: jumlah,
        tipe_mutasi: "masuk",
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

    // Update atau buat stok
    await prisma.stok.upsert({
      where: { produk_id },
      update: {
        jumlah_stok: { increment: jumlah },
        updated_at: new Date(),
      },
      create: {
        produk_id,
        jumlah_stok: jumlah,
        minimal_stok: 0,
        maksimal_stok: 0,
      },
    });

    return jsonResponse(
      {
        message: "Stock masuk berhasil ditambahkan",
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
