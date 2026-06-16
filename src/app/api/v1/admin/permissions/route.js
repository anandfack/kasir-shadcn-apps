import { withPermission } from "@/lib/withPermission";
import { getPermissions } from "@/modules/roles/roles.service";

export const GET = withPermission(getPermissions, "roles.view");
