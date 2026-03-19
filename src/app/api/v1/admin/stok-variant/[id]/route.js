import { updateStokVariant } from "@/modules/stok-variant/stokvariant.service";

export async function PUT(req, { params }) {
  return updateStokVariant(req, { params });
}
