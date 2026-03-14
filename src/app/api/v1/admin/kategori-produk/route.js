import {
  createKategoriProduk,
  getKategoriProduk,
} from "@/modules/kategori-produk/kategoriproduk.service";

export async function GET(req) {
  return getKategoriProduk(req);
}

export async function POST(req) {
  return createKategoriProduk(req);
}
