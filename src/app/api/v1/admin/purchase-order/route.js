import {
  createPurchaseOrder,
  getPurchaseOrder,
} from "@/modules/purchase-order/purchaseorder.service";

export async function GET(req) {
  return getPurchaseOrder(req);
}

export async function POST(req) {
  return createPurchaseOrder(req);
}
