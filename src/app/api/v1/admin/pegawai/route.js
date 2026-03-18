import { createPegawai, getPegawai } from "@/modules/pegawai/pegawai.service";

export async function GET(req) {
  return getPegawai(req);
}

export async function POST(req) {
  return createPegawai(req);
}

