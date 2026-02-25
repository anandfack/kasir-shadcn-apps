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
        penerimaanBarang: {
          select: {
            id: true,
            nomor_penerimaan: true,
            tanggal_penerimaan: true,
          },
        },
        // purchaseOrder: {
        //   select: {
        //     id: true,
        //     nomor_po: true,
        //     supplier: {
        //       select: {
        //         id: true,
        //         nama_supplier: true,
        //       },
        //     },
        //   },
        // },
        // pegawai: {
        //   select: {
        //     id: true,
        //     nama_pegawai: true,
        //   },
        // },
        // nomor_penerimaan: true,
        // tanggal_penerimaan: true,
        // status_penerimaan: true,
        // details: {
        //   select: {
        //     jumlah_produk: true,
        //     total_harga: true,
        //   },
        // },
      },
      //   where: {
      //     deleted_at: null,
      //   },
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
