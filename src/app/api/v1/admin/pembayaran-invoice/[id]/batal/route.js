import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = Number(params.id);

    const errors = {};

    // ambil pembayaran
    const pembayaran = await prisma.pembayaranInvoice.findUnique({
      where: { id },
    });

    if (!pembayaran) {
      errors.pembayaran = "Pembayaran tidak valid";
    } else if (pembayaran.deleted_at) {
      errors.pembayaran = "Pembayaran sudah dibatalkan";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    // ambil invoice
    const invoice = await prisma.invoicePembelian.findUnique({
      where: { id: pembayaran.invoice_id },
    });

    if (!invoice) {
      return jsonResponse(
        {
          message: "Invoice tidak ditemukan",
        },
        400,
      );
    }

    const sisaTagihanBaru = invoice.sisa_tagihan + pembayaran.jumlah_bayar;

    await prisma.$transaction([
      prisma.pembayaranInvoice.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      }),

      prisma.invoicePembelian.update({
        where: { id: invoice.id },
        data: {
          sisa_tagihan: sisaTagihanBaru,
          status:
            sisaTagihanBaru >= invoice.total_tagihan ? "UNPAID" : "PARTIAL",
        },
      }),
    ]);

    return jsonResponse({
      success: true,
      message: "Pembayaran berhasil dibatalkan",
    });
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        message: "Terjadi kesalahan server",
      },
      500,
    );
  }
}
