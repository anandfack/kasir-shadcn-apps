import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { newGenerateDocumentNumber } from "@/lib/documentNumber";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const invoice = await prisma.invoicePembelian.findMany({
      select: {
        id: true,
        nomor_invoice: true,
        tanggal_invoice: true,
        total_tagihan: true,
        sisa_tagihan: true,
        status: true,
      },
      orderBy: {
        tanggal_invoice: "desc",
      },
    });
    return jsonResponse(
      {
        message: "OK",
        data: invoice,
      },
      200,
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

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { tanggal_invoice, detail_items } = body;

    const pegawai_id = auth.user.id;

    const errors = {};

    if (!tanggal_invoice || tanggal_invoice.trim() === "") {
      errors.tanggal_invoice = "Tanggal penerimaan wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const nomorInvoice = await newGenerateDocumentNumber({
        tx,
        prefix: "INV",
        tanggal: new Date(),
      });

      let totalPenerimaan = 0;
      let totalRetur = 0;

      for (const item of detail_items) {
        const penerimaan = await prisma.penerimaanBarang.findUnique({
          where: { id: item.penerimaan_id },
          include: {
            details: true,
            returPenerimaans: true,
          },
        });

        if (!penerimaan) {
          throw new Error("Tidak ada penerimaan");
        }
        const subTotalPenerimaan =
          penerimaan.details.reduce(
            (sum, d) => sum + Number(d.total_harga || 0),
            0,
          ) || 0;
        const subTotalRetur =
          penerimaan.returPenerimaans.reduce(
            (sum, d) => sum + Number(d.total_harga || 0),
            0,
          ) || 0;

        totalPenerimaan += subTotalPenerimaan;
        totalRetur += subTotalRetur;
      }
      const totalTagihan = totalPenerimaan - totalRetur;
      const totalSisaTagihan = totalTagihan;

      if (totalTagihan <= 0) {
        throw new Error("Total tagihan tidak valid");
      }

      const invoicePembelian = await tx.invoicePembelian.create({
        data: {
          nomor_invoice: nomorInvoice,
          tanggal_invoice: new Date(tanggal_invoice),
          total_tagihan: totalTagihan,
          sisa_tagihan: totalSisaTagihan,
          pegawai_id: pegawai_id,
          status: "UNPAID",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await tx.invoicePenerimaan.createMany({
        data: detail_items.map((item) => ({
          invoice_id: invoicePembelian.id,
          penerimaan_id: item.penerimaan_id,
        })),
      });
    });

    return jsonResponse(
      {
        message: "Data pembelian berhasil ditambahkan",
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
