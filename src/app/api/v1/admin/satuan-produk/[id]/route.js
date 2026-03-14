import {
  deleteSatuanProduk,
  updateSatuanProduk,
} from "@/modules/satuan-produk/satuanproduk.service";

export async function PUT(req, { params }) {
  return updateSatuanProduk(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteSatuanProduk(req, { params });
}
