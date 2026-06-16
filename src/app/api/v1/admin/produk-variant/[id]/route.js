import { withPermission } from "@/lib/withPermission";
import {
  deleteProdukVariant,
  updateProdukVariant,
} from "@/modules/produk-variant/produkvariant.service";

export const PUT = withPermission(updateProdukVariant, "produk-variant.edit");
export const DELETE = withPermission(deleteProdukVariant, "produk-variant.delete");
