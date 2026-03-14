import { getMutasiStok } from "@/modules/mutasi-stok/mutasistok.service";

export async function GET(req, { params }) {
  return getMutasiStok(req, { params });
}
