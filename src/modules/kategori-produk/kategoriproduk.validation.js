export async function validateCreateKategoriProduk(data) {
  const errors = {};
  if (!data.kode_kategori || data.kode_kategori.trim() === "") {
    errors.kode_kategori = "Kode kategori wajib diisi";
  }
  if (!data.nama_kategori || data.nama_kategori.trim() === "") {
    errors.nama_kategori = "Nama kategori wajib diisi";
  }

  return errors;
}

export async function validateUpdateKategoriProduk(data) {
  const errors = {};
  if (!data.kode_kategori || data.kode_kategori.trim() === "") {
    errors.kode_kategori = "Kode kategori wajib diisi";
  }
  if (!data.nama_kategori || data.nama_kategori.trim() === "") {
    errors.nama_kategori = "Nama kategori wajib diisi";
  }

  return errors;
}
