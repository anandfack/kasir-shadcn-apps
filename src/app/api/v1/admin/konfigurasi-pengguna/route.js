import {
  createUser,
  getKonfigurasiPengguna,
} from "@/modules/konfigurasi-pengguna/konfigurasipengguna.service";

export async function GET(req) {
  return getKonfigurasiPengguna(req);
}

export async function POST(req) {
  return createUser(req);
}
