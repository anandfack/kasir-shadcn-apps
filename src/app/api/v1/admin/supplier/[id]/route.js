import { withPermission } from "@/lib/withPermission";
import {
  deleteSupplier,
  updateSupplier,
} from "@/modules/supplier/supplier.service";

export const PUT = withPermission(updateSupplier, "supplier.edit");
export const DELETE = withPermission(deleteSupplier, "supplier.delete");
