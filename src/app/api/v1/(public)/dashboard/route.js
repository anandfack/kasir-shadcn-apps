import { getDashboard } from "@/modules/public/dashboard/dashboard.service";

export async function GET(req) {
  return getDashboard(req);
}
