import { pembayaranInvoice } from "@/modules/invoice/invoice.service";

export async function POST(req) {
  return pembayaranInvoice(req);
}
