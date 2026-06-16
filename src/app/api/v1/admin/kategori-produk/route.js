import { withPermission } from "@/lib/withPermission";
import {
  createKategoriProduk,
  getKategoriProduk,
} from "@/modules/kategori-produk/kategoriproduk.service";

export const GET = withPermission(getKategoriProduk, "kategori-produk.view");
export const POST = withPermission(createKategoriProduk, "kategori-produk.create");
