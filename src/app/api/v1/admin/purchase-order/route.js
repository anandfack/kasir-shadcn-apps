import { withPermission } from "@/lib/withPermission";
import {
  createPurchaseOrder,
  getPurchaseOrder,
} from "@/modules/purchase-order/purchaseorder.service";

export const GET = withPermission(getPurchaseOrder, "purchase-order.view");
export const POST = withPermission(createPurchaseOrder, "purchase-order.create");
