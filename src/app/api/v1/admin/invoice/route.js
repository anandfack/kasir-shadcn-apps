import { withPermission } from "@/lib/withPermission";
import { createInvoice, getInvoice } from "@/modules/invoice/invoice.service";

export const GET = withPermission(getInvoice, "invoice.view");
export const POST = withPermission(createInvoice, "invoice.create");
