import { withPermission } from "@/lib/withPermission";
import { updateStokVariant } from "@/modules/stok-variant/stokvariant.service";

export const PUT = withPermission(updateStokVariant, "stok-variant.edit");
