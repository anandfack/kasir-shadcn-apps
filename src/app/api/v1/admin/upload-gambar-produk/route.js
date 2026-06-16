import { withPermission } from "@/lib/withPermission";
import { createGambarProduk } from "@/modules/upload-gambar-produk/uploadgambarproduk.service";

export const POST = withPermission(createGambarProduk, "produk.edit");
