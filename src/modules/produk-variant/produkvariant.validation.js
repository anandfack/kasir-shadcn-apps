export async function validateProdukVariant(data) {
  const errors = {};

  if (!data.produk_id) {
    errors.produk_id = "Produk wajib diisi";
  } else if (isNaN(Number(data.produk_id))) {
    errors.produk_id = "Produk tidak valid";
  }

  if (!Array.isArray(data.variants) || data.variants.length === 0) {
    errors.variants = "Variant minimal 1";
  }

  return errors;
}

export async function validateUpdateProdukVariant(data) {
  const errors = {};
  if (!data.sku || data.sku.trim() === "") {
    errors.sku = "Kode supplier wajib diisi";
  }
  if (!data.ukuran || data.ukuran.trim() === "") {
    errors.ukuran = "Nama supplier wajib diisi";
  }
  if (!data.warna || data.warna.trim() === "") {
    errors.warna = "Alamat supplier wajib diisi";
  }

  return errors;
}
