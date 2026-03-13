import { deleteProduk, updateProduk } from "@/modules/produk/produk.service";

export async function PUT(req, { params }) {
  return updateProduk(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteProduk(req, { params });
}
