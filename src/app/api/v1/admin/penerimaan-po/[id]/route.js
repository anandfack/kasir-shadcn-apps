import { withPermission } from "@/lib/withPermission";
import { getDetailPenerimaanPo } from "@/modules/penerimaan-po/penerimaanpo.service";

export const GET = withPermission(getDetailPenerimaanPo, "penerimaan-po.view");
