import { withPermission } from "@/lib/withPermission";
import { getMutasiStok } from "@/modules/mutasi-stok/mutasistok.service";

export const GET = withPermission(getMutasiStok, "mutasi-stok.view");
