import { withPermission } from "@/lib/withPermission";
import {
  createPenerimaanPo,
  getPenerimaanPo,
} from "@/modules/penerimaan-po/penerimaanpo.service";

export const GET = withPermission(getPenerimaanPo, "penerimaan-po.view");
export const POST = withPermission(createPenerimaanPo, "penerimaan-po.create");
