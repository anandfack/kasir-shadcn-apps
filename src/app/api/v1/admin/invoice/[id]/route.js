import { withPermission } from "@/lib/withPermission";
import { getDetailInvoice } from "@/modules/invoice/invoice.service";

export const GET = withPermission(getDetailInvoice, "invoice.view");
