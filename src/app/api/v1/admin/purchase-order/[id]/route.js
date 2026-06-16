import { withPermission } from "@/lib/withPermission";
import { getDetailPurchaseOrder } from "@/modules/purchase-order/purchaseorder.service";

export const GET = withPermission(getDetailPurchaseOrder, "purchase-order.view");
