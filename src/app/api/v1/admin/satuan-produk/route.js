import {
  createSatuanProduk,
  getSatuanProduk,
} from "@/modules/satuan-produk/satuanproduk.service";

export async function GET(req) {
  return getSatuanProduk(req);
}

export async function POST(req) {
  return createSatuanProduk(req);
}
