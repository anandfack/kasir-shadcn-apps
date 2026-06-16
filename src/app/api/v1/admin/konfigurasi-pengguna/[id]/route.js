import { withPermission } from "@/lib/withPermission";
import {
  deleteUser,
  updateUser,
} from "@/modules/konfigurasi-pengguna/konfigurasipengguna.service";

export const PUT = withPermission(updateUser, "konfigurasi-pengguna.edit");
export const DELETE = withPermission(deleteUser, "konfigurasi-pengguna.edit");
