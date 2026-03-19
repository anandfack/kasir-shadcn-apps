import { getDetailPenerimaanPo } from "@/modules/penerimaan-po/penerimaanpo.service";

export async function GET(req, { params }) {
  return getDetailPenerimaanPo(req, { params });
}
