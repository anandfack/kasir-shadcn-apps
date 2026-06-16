import { withPermission } from "@/lib/withPermission";
import { getRolePermissions, updateRolePermissions } from "@/modules/roles/roles.service";

export const GET = withPermission(getRolePermissions, "roles.view");
export const PUT = withPermission(updateRolePermissions, "roles.assign-permission");
