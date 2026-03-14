import {
  deleteKategoriProduk,
  updateKategoriProduk,
} from "@/modules/kategori-produk/kategoriproduk.service";

export async function PUT(req, { params }) {
  return updateKategoriProduk(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteKategoriProduk(req, { params });
}
