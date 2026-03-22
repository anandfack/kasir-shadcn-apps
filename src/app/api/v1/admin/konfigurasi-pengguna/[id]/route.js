import {
  deleteUser,
  updateUser,
} from "@/modules/konfigurasi-pengguna/konfigurasipengguna.service";

export async function PUT(req, { params }) {
  return updateUser(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteUser(req, { params });
}
