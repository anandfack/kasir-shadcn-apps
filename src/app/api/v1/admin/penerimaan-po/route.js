import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createPenerimaanPo,
  getPenerimaanPo,
} from "@/modules/penerimaan-po/penerimaanpo.service";

export async function GET(req) {
  return getPenerimaanPo(req);
}

export async function POST(req) {
  return createPenerimaanPo(req);
}
