import { createProduk, getProduk } from "@/modules/produk/produk.service";

export async function GET(req) {
  return getProduk(req);
}

export async function POST(req) {
  return createProduk(req);
}