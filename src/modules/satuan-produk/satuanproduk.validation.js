export async function validateCreateSatuanProduk(data) {
  const errors = {};
  if (!data.kode_satuan || data.kode_satuan.trim() === "") {
    errors.kode_satuan = "Kode satuan wajib diisi";
  }
  if (!data.nama_satuan || data.nama_satuan.trim() === "") {
    errors.nama_satuan = "Nama satuan wajib diisi";
  }

  return errors;
}

export async function validateUpdateSatuanProduk(data) {
  const errors = {};

  if (!data.kode_satuan || data.kode_satuan.trim() === "") {
    errors.kode_satuan = "Kode satuan wajib diisi";
  }
  if (!data.nama_satuan || data.nama_satuan.trim() === "") {
    errors.nama_satuan = "Nama satuan wajib diisi";
  }

  return errors;
}
