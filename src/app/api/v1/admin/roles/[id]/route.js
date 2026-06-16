import { withPermission } from "@/lib/withPermission";
import { updateRole, deleteRole } from "@/modules/roles/roles.service";

export const PUT = withPermission(updateRole, "roles.edit");
export const DELETE = withPermission(deleteRole, "roles.delete");
