import { withPermission } from "@/lib/withPermission";
import {
  createUser,
  getKonfigurasiPengguna,
} from "@/modules/konfigurasi-pengguna/konfigurasipengguna.service";

export const GET = withPermission(getKonfigurasiPengguna, "konfigurasi-pengguna.view");
export const POST = withPermission(createUser, "konfigurasi-pengguna.edit");
