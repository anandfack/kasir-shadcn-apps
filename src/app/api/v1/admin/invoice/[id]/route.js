import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { getDetailInvoice } from "@/modules/invoice/invoice.service";

export async function GET(req, { params }) {
  return getDetailInvoice(req, { params });
}
