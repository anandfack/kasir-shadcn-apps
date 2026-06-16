import { withPermission } from "@/lib/withPermission";
import {
  createSatuanProduk,
  getSatuanProduk,
} from "@/modules/satuan-produk/satuanproduk.service";

export const GET = withPermission(getSatuanProduk, "satuan-produk.view");
export const POST = withPermission(createSatuanProduk, "satuan-produk.create");
