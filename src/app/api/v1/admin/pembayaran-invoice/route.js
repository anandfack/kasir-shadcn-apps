import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { newGenerateDocumentNumber } from "@/lib/documentNumber";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const pegawaiId = auth.user.pegawai_id;

    const body = await req.json();
    const {
      invoice_id,
      jumlah_bayar,
      nomor_referensi,
      nomor_rekening,
      metode_bayar,
    } = body;

    const errors = {};

    if (!invoice_id) {
      errors.invoice_id = "Invoice wajib diisi";
    } else if (isNaN(Number(invoice_id))) {
      errors.invoice_id = "Invoice tidak valid";
    }

    if (
      jumlah_bayar === undefined ||
      jumlah_bayar === null ||
      jumlah_bayar === ""
    ) {
      errors.jumlah_bayar = "Total bayar wajib diisi";
    } else if (isNaN(Number(jumlah_bayar))) {
      errors.jumlah_bayar = "Total bayar harus berupa angka";
    } else if (Number(jumlah_bayar) < 0) {
      errors.jumlah_bayar = "Total bayar tidak boleh kurang dari 0";
    }

    if (!metode_bayar || metode_bayar.trim() === "") {
      errors.metode_bayar = "Metode bayar wajib diisi";
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

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoicePembelian.findUnique({
        where: { id: Number(invoice_id) },
        select: {
          id: true,
          total_tagihan: true,
        },
      });

      if (!invoice) {
        throw new Error("Invoice tidak ditemukan");
      }

      const totalPembayaran = await tx.pembayaranInvoice.aggregate({
        where: {
          invoice_id: invoice.id,
        },
        _sum: {
          jumlah_bayar: true,
        },
      });

      const totalSudahDibayar = totalPembayaran._sum.jumlah_bayar || 0;

      const sisaSaatIni = invoice.total_tagihan - totalSudahDibayar;

      if (Number(jumlah_bayar) > sisaSaatIni) {
        throw new Error("Jumlah bayar melebihi sisa tagihan");
      }

      const nomorPembayaran = await newGenerateDocumentNumber({
        tx,
        prefix: "PEMB-INV",
        tanggal: new Date(),
      });

      await tx.pembayaranInvoice.create({
        data: {
          invoice: { connect: { id: invoice.id } },
          pegawai: { connect: { id: pegawaiId } },
          jumlah_bayar: Number(jumlah_bayar),
          nomor_referensi,
          nomor_rekening,
          metode_bayar,
          tanggal_bayar: new Date(),
          nomor_pembayaran: nomorPembayaran,
        },
      });

      const totalBaru = totalSudahDibayar + Number(jumlah_bayar);
      const sisaBaru = invoice.total_tagihan - totalBaru;

      await tx.invoicePembelian.update({
        where: { id: invoice.id },
        data: {
          sisa_tagihan: sisaBaru,
          status: sisaBaru <= 0 ? "PAID" : totalBaru > 0 ? "PARTIAL" : "UNPAID",
        },
      });

      return {
        invoice_id: invoice.id,
        sisa_tagihan: sisaBaru,
      };
    });

    return jsonResponse(
      {
        message: "Pembayaran berhasil ditambahkan",
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
