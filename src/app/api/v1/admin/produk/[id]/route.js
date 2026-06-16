import { withPermission } from "@/lib/withPermission";
import { deleteProduk, updateProduk } from "@/modules/produk/produk.service";

export const PUT = withPermission(updateProduk, "produk.edit");
export const DELETE = withPermission(deleteProduk, "produk.delete");
