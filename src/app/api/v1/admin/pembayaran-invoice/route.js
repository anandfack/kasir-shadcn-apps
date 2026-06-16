import { withPermission } from "@/lib/withPermission";
import { pembayaranInvoice } from "@/modules/invoice/invoice.service";

export const POST = withPermission(pembayaranInvoice, "invoice.bayar");
