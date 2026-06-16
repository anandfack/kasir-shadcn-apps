import { verifyAuth } from "@/lib/verifyAuth";
import { getUserPermissions } from "@/lib/permission";
import jsonResponse from "@/lib/jsonResponse";

export async function GET(req) {
  const auth = verifyAuth(req);

  if (auth.error) {
    return jsonResponse({ message: auth.error }, 401);
  }

  try {
    const permissions = await getUserPermissions(auth.user.id);

    return jsonResponse({
      message: "OK",
      data: {
        id: auth.user.id,
        pegawai_id: auth.user.pegawai_id,
        permissions,
      },
    });
  } catch (error) {
    console.error("Error get me:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
