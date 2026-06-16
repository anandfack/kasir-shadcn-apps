import { withPermission } from "@/lib/withPermission";
import { getMutasiStokVariant } from "@/modules/mutasi-stok-variant/mutasistokvariant.service";

export const GET = withPermission(getMutasiStokVariant, "mutasi-stok.view");
