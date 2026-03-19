import { getDetailPurchaseOrder } from "@/modules/purchase-order/purchaseorder.service";

export async function GET(req, { params }) {
  return getDetailPurchaseOrder(req, { params });
}
