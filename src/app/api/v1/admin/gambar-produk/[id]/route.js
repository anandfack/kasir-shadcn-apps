import { withPermission } from "@/lib/withPermission";
import { getGambarProduk } from "@/modules/gambar-produk/gambarproduk.service";

export const GET = withPermission(getGambarProduk, "produk.view");
