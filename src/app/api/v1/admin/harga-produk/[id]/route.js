import {
  deleteHargaProduk,
  updateHargaProduk,
} from "@/modules/harga-produk/hargaproduk.service";

export async function PUT(req, { params }) {
  return updateHargaProduk(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteHargaProduk(req, { params });
}
