import { withPermission } from "@/lib/withPermission";
import { getRoles, createRole } from "@/modules/roles/roles.service";

export const GET = withPermission(getRoles, "roles.view");
export const POST = withPermission(createRole, "roles.create");
