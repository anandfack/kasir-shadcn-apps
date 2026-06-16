import { withPermission } from "@/lib/withPermission";
import { createReturPenerimaan } from "@/modules/retur-penerimaan/returpenerimaan.service";

export const POST = withPermission(createReturPenerimaan, "retur-penerimaan.create");
