import { withPermission } from "@/lib/withPermission";
import {
  deleteSatuanProduk,
  updateSatuanProduk,
} from "@/modules/satuan-produk/satuanproduk.service";

export const PUT = withPermission(updateSatuanProduk, "satuan-produk.edit");
export const DELETE = withPermission(deleteSatuanProduk, "satuan-produk.delete");
