import { withPermission } from "@/lib/withPermission";
import {
  createSupplier,
  getSupplier,
} from "@/modules/supplier/supplier.service";

export const GET = withPermission(getSupplier, "supplier.view");
export const POST = withPermission(createSupplier, "supplier.create");
