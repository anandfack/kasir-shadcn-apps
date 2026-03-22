import { resetPassword } from "@/modules/konfigurasi-pengguna/konfigurasipengguna.service";

export async function PUT(req, { params }) {
  return resetPassword(req, { params });
}
