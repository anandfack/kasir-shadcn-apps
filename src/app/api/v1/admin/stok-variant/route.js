import { withPermission } from "@/lib/withPermission";
import { getStokVariant } from "@/modules/stok-variant/stokvariant.service";

export const GET = withPermission(getStokVariant, "stok-variant.view");
