import { withPermission } from "@/lib/withPermission";
import { createPegawai, getPegawai } from "@/modules/pegawai/pegawai.service";

export const GET = withPermission(getPegawai, "pegawai.view");
export const POST = withPermission(createPegawai, "pegawai.create");

