import { withPermission } from "@/lib/withPermission";
import {
  createProdukVariant,
  getProdukVariant,
} from "@/modules/produk-variant/produkvariant.service";

export const GET = withPermission(getProdukVariant, "produk-variant.view");
export const POST = withPermission(createProdukVariant, "produk-variant.create");
