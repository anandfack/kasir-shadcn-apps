import {
  createSupplier,
  getSupplier,
} from "@/modules/supplier/supplier.service";

export async function GET(req) {
  return getSupplier(req);
}

export async function POST(req) {
  return createSupplier(req);
}
