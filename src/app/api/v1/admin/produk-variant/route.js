import {
  createProdukVariant,
  getProdukVariant,
} from "@/modules/produk-variant/produkvariant.service";

export async function GET(req) {
  return getProdukVariant(req);
}

export async function POST(req) {
  return createProdukVariant(req);
}
