import { getGambarProduk } from "@/modules/gambar-produk/gambarproduk.service";

export async function GET(req, { params }) {
  return getGambarProduk(req, { params });
}
