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

    const invoiceId = Number(params.id);

    const invoicePembelian = await prisma.invoicePembelian.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        nomor_invoice: true,
        tanggal_invoice: true,
        total_tagihan: true,
        sisa_tagihan: true,
        status: true,
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
        pembayaranInvoices: {
          select: {
            id: true,
            nomor_pembayaran: true,
            tanggal_bayar: true,
            jumlah_bayar: true,
            metode_bayar: true,
            nomor_referensi: true,
            nomor_rekening: true,
            deleted_at: true,
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

    if (!invoicePembelian) {
      return jsonResponse({ message: "Data tidak ditemukan" }, 404);
    }

    // const totalBayar = pembelian.pembayaranPembelian.reduce(
    //   (sum, p) => sum + p.jumlah_bayar,
    //   0,
    // );

    // const statusPembayaran = hitungStatusPembayaran(
    //   pembelian.pembayaranPembelian,
    //   pembelian.total_harga,
    // );

    return jsonResponse(
      {
        message: "OK",
        data: {
          ...invoicePembelian,
          //   total_bayar: totalBayar,
          //   status_pembayaran: statusPembayaran,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
