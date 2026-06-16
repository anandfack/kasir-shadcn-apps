import { verifyAuth } from "./verifyAuth";
import jsonResponse from "./jsonResponse";
import { requirePermission, ForbiddenError } from "./permission";

export function withPermission(handler, permissionName) {
  return async (req, context) => {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    try {
      await requirePermission(auth.user.id, permissionName);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return jsonResponse({ message: error.message }, 403);
      }

      return jsonResponse({ message: "Internal Server Error" }, 500);
    }

    return handler(req, context);
  };
}
