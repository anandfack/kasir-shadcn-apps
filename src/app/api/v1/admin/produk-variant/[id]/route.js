import {
  deleteProdukVariant,
  updateProdukVariant,
} from "@/modules/produk-variant/produkvariant.service";

export async function PUT(req, { params }) {
  return updateProdukVariant(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteProdukVariant(req, { params });
}
