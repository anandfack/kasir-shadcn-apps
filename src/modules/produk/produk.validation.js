export function validateProduk(data) {
  const errors = {};

  if (!data.satuan_produk_id) {
    errors.satuan_produk_id = "Satuan produk wajib diisi";
  } else if (isNaN(Number(data.satuan_produk_id))) {
    errors.satuan_produk_id = "Satuan produk tidak valid";
  }
  if (!data.kategori_id) {
    errors.kategori_id = "Kategori wajib diisi";
  } else if (isNaN(Number(data.kategori_id))) {
    errors.kategori_id = "Kategori tidak valid";
  }
  if (!data.supplier_id) {
    errors.supplier_id = "Supplier wajib diisi";
  } else if (isNaN(Number(data.supplier_id))) {
    errors.supplier_id = "Supplier tidak valid";
  }

  if (!data.kode_produk || data.kode_produk.trim() === "") {
    errors.kode_produk = "Kode produk wajib diisi";
  }
  if (!data.nama_produk || data.nama_produk.trim() === "") {
    errors.nama_produk = "Nama produk wajib diisi";
  }
  if (!data.deskripsi_produk || data.deskripsi_produk.trim() === "") {
    errors.deskripsi_produk = "Deskripsi produk wajib diisi";
  }
  return errors;
}

// export function validateUpdateProduk(data) {
//   const errors = {};

//   if (!data.satuan_produk_id) {
//     errors.satuan_produk_id = "Satuan produk wajib diisi";
//   } else if (isNaN(Number(data.satuan_produk_id))) {
//     errors.satuan_produk_id = "Satuan produk tidak valid";
//   }
//   if (!data.kategori_id) {
//     errors.kategori_id = "Kategori wajib diisi";
//   } else if (isNaN(Number(data.kategori_id))) {
//     errors.kategori_id = "Kategori tidak valid";
//   }
//   if (!data.supplier_id) {
//     errors.supplier_id = "Supplier wajib diisi";
//   } else if (isNaN(Number(data.supplier_id))) {
//     errors.supplier_id = "Supplier tidak valid";
//   }

//   if (!data.kode_produk || data.kode_produk.trim() === "") {
//     errors.kode_produk = "Kode produk wajib diisi";
//   }
//   if (!data.nama_produk || data.nama_produk.trim() === "") {
//     errors.nama_produk = "Nama produk wajib diisi";
//   }
//   if (!data.deskripsi_produk || data.deskripsi_produk.trim() === "") {
//     errors.deskripsi_produk = "Deskripsi produk wajib diisi";
//   }
//   return errors;
// }
