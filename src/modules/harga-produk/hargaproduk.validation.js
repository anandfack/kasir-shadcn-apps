export async function validateCreateHargaProduk(data) {
  const errors = {};
  if (!data.produk_id) {
    errors.produk_id = "Produk wajib diisi";
  } else if (isNaN(Number(data.produk_id))) {
    errors.produk_id = "Produk tidak valid";
  }

  if (
    data.harga_jual === undefined ||
    data.harga_jual === null ||
    data.harga_jual === ""
  ) {
    errors.harga_jual = "Harga jual wajib diisi";
  } else if (isNaN(Number(data.harga_jual))) {
    errors.harga_jual = "Harga jual harus berupa angka";
  } else if (Number(data.harga_jual) < 0) {
    errors.harga_jual = "Harga jual tidak boleh kurang dari 0";
  }

  if (
    data.harga_beli === undefined ||
    data.harga_beli === null ||
    data.harga_beli === ""
  ) {
    errors.harga_beli = "Harga beli wajib diisi";
  } else if (isNaN(Number(data.harga_beli))) {
    errors.harga_beli = "Harga beli harus berupa angka";
  } else if (Number(data.harga_beli) < 0) {
    errors.harga_beli = "Harga beli tidak boleh kurang dari 0";
  }

  if (
    !errors.harga_jual &&
    !errors.harga_beli &&
    Number(data.harga_jual) < Number(data.harga_beli)
  ) {
    errors.harga_jual = "Harga jual tidak boleh lebih kecil dari harga beli";
  }

  return errors;
}

export async function validateUpdateHargaProduk(data) {
  const errors = {};
  if (data.produk_id !== undefined) {
    if (!data.produk_id) {
      errors.produk_id = "Produk wajib diisi";
    } else if (isNaN(Number(data.produk_id))) {
      errors.produk_id = "Produk tidak valid";
    }
  }

  if (data.harga_jual !== undefined) {
    if (data.harga_jual === null || data.harga_jual === "") {
      errors.harga_jual = "Harga jual tidak boleh kosong";
    } else if (isNaN(Number(data.harga_jual))) {
      errors.harga_jual = "Harga jual harus berupa angka";
    } else if (Number(data.harga_jual) < 0) {
      errors.harga_jual = "Harga jual tidak boleh kurang dari 0";
    }
  }

  if (data.harga_beli !== undefined) {
    if (data.harga_beli === null || data.harga_beli === "") {
      errors.harga_beli = "Harga beli tidak boleh kosong";
    } else if (isNaN(Number(data.harga_beli))) {
      errors.harga_beli = "Harga beli harus berupa angka";
    } else if (Number(data.harga_beli) < 0) {
      errors.harga_beli = "Harga beli tidak boleh kurang dari 0";
    }
  }

  if (
    data.harga_jual !== undefined &&
    data.harga_beli !== undefined &&
    !errors.harga_jual &&
    !errors.harga_beli &&
    Number(data.harga_jual) < Number(data.harga_beli)
  ) {
    errors.harga_jual = "Harga jual tidak boleh lebih kecil dari harga beli";
  }

  return errors;
}
