import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { hitungStatusPembayaran } from "@/lib/hitungStatusPembayaran";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const pembelianId = Number(params.id);

    const pembelian = await prisma.pembelian.findUnique({
      where: { id: pembelianId },
      select: {
        id: true,
        nomor_pembelian: true,
        nomor_faktur: true,
        tanggal_pembelian: true,
        total_harga: true,
        status_pembelian: true,
        supplier: {
          select: { nama_supplier: true },
        },
        pembayaranPembelian: {
          where: { deleted_at: null },
          orderBy: { tanggal_bayar: "asc" },
          select: {
            id: true,
            tanggal_bayar: true,
            jumlah_bayar: true,
            metode_bayar: true,
            nomor_referensi: true,
            pegawai: {
              select: {
                id: true,
                nama_pegawai: true,
              },
            },
          },
        },
      },
    });

    if (!pembelian) {
      return jsonResponse({ message: "Data tidak ditemukan" }, 404);
    }

    const totalBayar = pembelian.pembayaranPembelian.reduce(
      (sum, p) => sum + p.jumlah_bayar,
      0
    );

    const statusPembayaran = hitungStatusPembayaran(
      pembelian.pembayaranPembelian,
      pembelian.total_harga
    );

    return jsonResponse(
      {
        message: "OK",
        data: {
          ...pembelian,
          total_bayar: totalBayar,
          status_pembayaran: statusPembayaran,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
