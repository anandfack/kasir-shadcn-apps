import { batalPembayaranInvoice } from "@/modules/invoice/invoice.service";

export async function POST(req, { params }) {
  return batalPembayaranInvoice(req, { params });
}
