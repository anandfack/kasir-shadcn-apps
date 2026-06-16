import { withPermission } from "@/lib/withPermission";
import {
  deleteHargaProduk,
  updateHargaProduk,
} from "@/modules/harga-produk/hargaproduk.service";

export const PUT = withPermission(updateHargaProduk, "harga-produk.edit");
export const DELETE = withPermission(deleteHargaProduk, "harga-produk.delete");
