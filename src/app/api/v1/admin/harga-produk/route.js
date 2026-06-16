import { withPermission } from "@/lib/withPermission";
import {
  createHargaProduk,
  getHargaProduk,
} from "@/modules/harga-produk/hargaproduk.service";

export const GET = withPermission(getHargaProduk, "harga-produk.view");
export const POST = withPermission(createHargaProduk, "harga-produk.create");