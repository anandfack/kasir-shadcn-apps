import { prisma } from "@/lib/prisma";

export async function validateCreateInvoice(data) {
  const errors = {};
  if (!data.tanggal_invoice || data.tanggal_invoice.trim() === "") {
    errors.tanggal_invoice = "Tanggal penerimaan wajib diisi";
  }

  return errors;
}

export async function validatePembayaranInvoice(data) {
  const errors = {};
  if (!data.invoice_id) {
    errors.invoice_id = "Invoice wajib diisi";
  } else if (isNaN(Number(data.invoice_id))) {
    errors.invoice_id = "Invoice tidak valid";
  }

  if (
    data.jumlah_bayar === undefined ||
    data.jumlah_bayar === null ||
    data.jumlah_bayar === ""
  ) {
    errors.jumlah_bayar = "Total bayar wajib diisi";
  } else if (isNaN(Number(data.jumlah_bayar))) {
    errors.jumlah_bayar = "Total bayar harus berupa angka";
  } else if (Number(data.jumlah_bayar) < 0) {
    errors.jumlah_bayar = "Total bayar tidak boleh kurang dari 0";
  }

  if (!data.metode_bayar || data.metode_bayar.trim() === "") {
    errors.metode_bayar = "Metode bayar wajib diisi";
  }

  return errors;
}

export async function validateBatalPembayaranInvoice(id) {
  const errors = {};
  const pembayaran = await prisma.pembayaranInvoice.findUnique({
    where: { id },
  });

  if (!pembayaran) {
    errors.pembayaran = "Pembayaran tidak valid";
  } else if (pembayaran.deleted_at) {
    errors.pembayaran = "Pembayaran sudah dibatalkan";
  }

  return errors;
}
