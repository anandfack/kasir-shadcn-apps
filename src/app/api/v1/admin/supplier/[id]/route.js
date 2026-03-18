import {
  deleteSupplier,
  updateSupplier,
} from "@/modules/supplier/supplier.service";

export async function PUT(req, { params }) {
  return updateSupplier(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteSupplier(req, { params });
}
