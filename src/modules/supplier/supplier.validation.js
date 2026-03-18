export async function validateCreateSupplier(data) {
  const errors = {};
  if (!data.kode_supplier || data.kode_supplier.trim() === "") {
    errors.kode_supplier = "Kode supplier wajib diisi";
  }
  if (!data.nama_supplier || data.nama_supplier.trim() === "") {
    errors.nama_supplier = "Nama supplier wajib diisi";
  }
  if (!data.alamat_supplier || data.alamat_supplier.trim() === "") {
    errors.alamat_supplier = "Alamat supplier wajib diisi";
  }
  if (data.nomor_telepon_supplier !== undefined) {
    const phone = data.nomor_telepon_supplier?.trim();

    if (!phone) {
      errors.nomor_telepon_supplier = "Nomor telepon tidak boleh kosong";
    } else if (!/^\d+$/.test(phone)) {
      errors.nomor_telepon_supplier = "Nomor telepon hanya boleh berisi angka";
    } else if (phone.length < 9 || phone.length > 15) {
      errors.nomor_telepon_supplier = "Panjang nomor telepon tidak valid";
    } else if (!/^(\+62|62|08)/.test(phone)) {
      errors.nomor_telepon_supplier =
        "Format nomor telepon Indonesia tidak valid";
    } else if (/^(\d)\1+$/.test(phone)) {
      errors.nomor_telepon_supplier = "Nomor telepon tidak valid";
    }
  }

  return errors;
}

export async function validateUpdateSupplier(data) {
  const errors = {};
  if (!data.kode_supplier || data.kode_supplier.trim() === "") {
    errors.kode_supplier = "Kode supplier wajib diisi";
  }
  if (!data.nama_supplier || data.nama_supplier.trim() === "") {
    errors.nama_supplier = "Nama supplier wajib diisi";
  }
  if (!data.alamat_supplier || data.alamat_supplier.trim() === "") {
    errors.alamat_supplier = "Alamat supplier wajib diisi";
  }
  if (data.nomor_telepon_supplier !== undefined) {
    const phone = data.nomor_telepon_supplier?.trim();

    if (!phone) {
      errors.nomor_telepon_supplier = "Nomor telepon tidak boleh kosong";
    } else if (!/^\d+$/.test(phone)) {
      errors.nomor_telepon_supplier = "Nomor telepon hanya boleh berisi angka";
    } else if (phone.length < 9 || phone.length > 15) {
      errors.nomor_telepon_supplier = "Panjang nomor telepon tidak valid";
    } else if (!/^(\+62|62|08)/.test(phone)) {
      errors.nomor_telepon_supplier =
        "Format nomor telepon Indonesia tidak valid";
    } else if (/^(\d)\1+$/.test(phone)) {
      errors.nomor_telepon_supplier = "Nomor telepon tidak valid";
    }
  }

  return errors;
}
