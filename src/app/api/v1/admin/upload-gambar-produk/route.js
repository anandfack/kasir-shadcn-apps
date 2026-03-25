import { createGambarProduk } from "@/modules/upload-gambar-produk/uploadgambarproduk.service";

export async function POST(req) {
  return createGambarProduk(req);
}
