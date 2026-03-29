import jsonResponse from "@/lib/jsonResponse";
import { getDashboardRepo } from "./dashboard.repository";
import { verifyPublicApiKey } from "@/lib/verifyPublicApiKey";

export async function getDashboard(req) {
  try {
    verifyPublicApiKey(req);

    const dashboard = await getDashboardRepo();

    return jsonResponse(
      {
        data: dashboard,
        message: "OK",
      },
      200,
    );
  } catch (error) {
    console.log(error);
    return jsonResponse(
      {
        message: "Internal server error",
      },
      500,
    );
  }
}
