import { getMutasiStokVariant } from "@/modules/mutasi-stok-variant/mutasistokvariant.service";

export async function GET(req, { params }) {
  return getMutasiStokVariant(req, { params });
}
