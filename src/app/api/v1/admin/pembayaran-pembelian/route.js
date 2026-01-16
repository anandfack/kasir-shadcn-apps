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

    const pegawaiId = auth.user.pegawai_id;

    const body = await req.json();
    const {
      pembelian_id,
      jumlah_bayar,
      nomor_referensi,
      nomor_rekening,
      metode_bayar,
    } = body;

    const errors = {};

    if (!pembelian_id) {
      errors.pembelian_id = "Pembelian wajib diisi";
    } else if (isNaN(Number(pembelian_id))) {
      errors.pembelian_id = "Pembelian tidak valid";
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
        400
      );
    }

    const tambahPembayaranPembelian = await prisma.pembayaranPembelian.create({
      data: {
        pembelian: { connect: { id: pembelian_id } },
        pegawai: { connect: { id: pegawaiId } },
        jumlah_bayar,
        nomor_referensi,
        nomor_rekening,
        metode_bayar,
        tanggal_bayar: new Date(),
        // nomor_pembayaran: `BYR-${new Date()}`,
      },
    });

    return jsonResponse(
      {
        message: "Pembayaran berhasil ditambahkan",
        data: tambahPembayaranPembelian,
      },
      201
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
