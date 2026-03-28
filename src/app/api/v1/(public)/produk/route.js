import jsonResponse from "@/lib/jsonResponse";
import { verifyPublicToken } from "@/lib/verifyPublicToken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    await verifyPublicToken(token);

    return jsonResponse(
      {
        message: "Check public data",
      },
      200,
    );
  } catch (error) {
    console.log(error);
    return jsonResponse(
      {
        message: "Unauthorized",
      },
      401,
    );
  }
}
