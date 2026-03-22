import { createInvoice, getInvoice } from "@/modules/invoice/invoice.service";

export async function GET(req) {
  return getInvoice(req);
}

export async function POST(req) {
  return createInvoice(req);
}
