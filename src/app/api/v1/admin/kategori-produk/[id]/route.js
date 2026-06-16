import { withPermission } from "@/lib/withPermission";
import {
  deleteKategoriProduk,
  updateKategoriProduk,
} from "@/modules/kategori-produk/kategoriproduk.service";

export const PUT = withPermission(updateKategoriProduk, "kategori-produk.edit");
export const DELETE = withPermission(deleteKategoriProduk, "kategori-produk.delete");
