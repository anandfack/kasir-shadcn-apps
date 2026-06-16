import { withPermission } from "@/lib/withPermission";
import { createProduk, getProduk } from "@/modules/produk/produk.service";

export const GET = withPermission(getProduk, "produk.view");
export const POST = withPermission(createProduk, "produk.create");