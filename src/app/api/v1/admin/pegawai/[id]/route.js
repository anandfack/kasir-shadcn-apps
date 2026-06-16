import { withPermission } from "@/lib/withPermission";
import {
  deletePegawai,
  getDetailPegawai,
  updatePegawai,
} from "@/modules/pegawai/pegawai.service";

export const GET = withPermission(getDetailPegawai, "pegawai.view");
export const PUT = withPermission(updatePegawai, "pegawai.edit");
export const DELETE = withPermission(deletePegawai, "pegawai.delete");
