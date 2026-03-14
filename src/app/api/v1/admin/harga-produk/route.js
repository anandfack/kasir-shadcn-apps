import {
  createHargaProduk,
  getHargaProduk,
} from "@/modules/harga-produk/hargaproduk.service";

export async function GET(req) {
  return getHargaProduk(req);
}

export async function POST(req) {
  return createHargaProduk(req);
}