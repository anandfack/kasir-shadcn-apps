import { getDetailProducts } from "@/modules/public/products/products.service";

export async function GET(req, { params }) {
  return getDetailProducts(req, { params });
}
