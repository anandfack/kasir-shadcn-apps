import { getStokVariant } from "@/modules/stok-variant/stokvariant.service";

export async function GET(req) {
  return getStokVariant(req);
}
