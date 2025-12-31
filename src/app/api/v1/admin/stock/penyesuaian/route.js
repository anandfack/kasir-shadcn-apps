// app/api/v1/admin/stok/penyesuaian/route.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { produk_id, stok_fisik, keterangan_mutasi } = body;

    if (!produk_id || stok_fisik === undefined) {
      return Response.json(
        { error: "produk_id dan stok_fisik wajib diisi" },
        { status: 400 }
      );
    }

    /* =========================
       3. GET STOK SISTEM
    ========================= */
    const stok = await prisma.stok.findUnique({
      where: { produk_id },
    });

    if (!stok) {
      return Response.json(
        { error: "Data stok tidak ditemukan" },
        { status: 404 }
      );
    }

    /* =========================
       4. HITUNG SELISIH
    ========================= */
    const selisih = stok_fisik - stok.jumlah_stok;

    if (selisih === 0) {
      return Response.json(
        { error: "Tidak ada selisih stok" },
        { status: 400 }
      );
    }

    // const tipe_mutasi = selisih > 0 ? "MASUK" : "KELUAR";

    /* =========================
       5. TRANSAKSI
    ========================= */
    await prisma.$transaction([
      prisma.mutasiStok.create({
        data: {
          produk_id,
          jumlah_mutasi: Math.abs(selisih),
          tipe_mutasi: "PENYESUAIAN",
          keterangan_mutasi,
          nomor_mutasi: `MT-PY-${Date.now()}`,
          //   pegawai_id: user.pegawai_id,
          tanggal_mutasi: new Date(),
        },
      }),
      prisma.stok.update({
        where: { produk_id },
        data: {
          jumlah_stok: stok_fisik,
          updated_at: new Date(),
        },
      }),
    ]);

    /* =========================
       6. RESPONSE
    ========================= */
    return Response.json({
      message: "Penyesuaian stok berhasil",
      data: {
        produk_id,
        stok_sebelum: stok.jumlah_stok,
        stok_fisik,
        selisih,
        // pegawai_id: user.pegawai_id,
      },
    });
  } catch (error) {
    console.error("PENYESUAIAN ERROR:", error);

    return Response.json(
      { error: "Token tidak valid / kadaluarsa" },
      { status: 401 }
    );
  }
}
