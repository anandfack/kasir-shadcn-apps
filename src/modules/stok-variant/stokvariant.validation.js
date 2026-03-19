export async function validateUpdateStokVariant(data) {
  const errors = {};
  if (
    data.minimal_stok === undefined ||
    data.minimal_stok === null ||
    data.minimal_stok === ""
  ) {
    errors.minimal_stok = "Nilai minimal tidak boleh kosong";
  } else if (isNaN(data.minimal_stok)) {
    errors.minidata.mal_stok = "Nilai minimal harus berupa angka";
  } else if (Number(data.minimal_stok) < 0) {
    errors.minimal_stok = "Nilai minimal tidak boleh kurang dari 0";
  }

  if (
    data.maksimal_stok === undefined ||
    data.maksimal_stok === null ||
    data.maksimal_stok === ""
  ) {
    errors.maksimal_stok = "Nilai maksimal tidak boleh kosong";
  } else if (isNaN(data.maksimal_stok)) {
    errors.maksimal_stok = "Nilai maksimal harus berupa angka";
  } else if (Number(data.maksimal_stok) < 0) {
    errors.maksimal_stok = "Nilai maksimal tidak boleh kurang dari 0";
  }

  if (
    !isNaN(data.minimal_stok) &&
    !isNaN(data.maksimal_stok) &&
    Number(data.minimal_stok) > Number(data.maksimal_stok)
  ) {
    errors.maksimal_stok =
      "Maksimal stok tidak boleh lebih kecil dari minimal stok";
  }

  return errors;
}

export async function validateAdjustStokVariant(data) {
  const errors = {};
  if (!data.produk_variant_id) {
    errors.produk_variant_id = "Produk variant wajib diisi";
  }

  if (
    data.stok_fisik === undefined ||
    data.stok_fisik === null ||
    data.stok_fisik === ""
  ) {
    errors.stok_fisik = "Stok fisik wajib diisi";
  } else if (isNaN(data.stok_fisik)) {
    errors.stok_fisik = "Stok fisik harus berupa angka";
  } else if (Number(data.stok_fisik) < 0) {
    errors.stok_fisik = "Stok fisik tidak boleh kurang dari 0";
  }

  if (!data.keterangan_mutasi) {
    errors.keterangan_mutasi = "Keterangan mutasi wajib diisi";
  }

  return errors;
}
