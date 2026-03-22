import { getHistoryPembayaranInvoice } from "@/modules/invoice/invoice.service";

export async function GET(req, { params }) {
  return getHistoryPembayaranInvoice(req, { params });
}
