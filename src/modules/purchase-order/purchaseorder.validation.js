export async function validateCreatePurchaseOrder(data) {
  const errors = {};
  if (!data.supplier_id) {
    errors.supplier_id = "Supplier wajib diisi";
  } else if (isNaN(Number(data.supplier_id))) {
    errors.supplier_id = "Supplier tidak valid";
  }

  if (!data.tanggal_po || data.tanggal_po.trim() === "") {
    errors.tanggal_po = "Tanggal pembelian wajib diisi";
  }
  if (!data.tanggal_po || data.tanggal_po.trim() === "") {
    errors.tanggal_po = "Tanggal pembelian wajib diisi";
  }

  if (
    data.total_harga === undefined ||
    data.total_harga === null ||
    data.total_harga === ""
  ) {
    errors.total_harga = "Total harga wajib diisi";
  } else if (isNaN(Number(data.total_harga))) {
    errors.total_harga = "Total harga harus berupa angka";
  } else if (Number(data.total_harga) < 0) {
    errors.total_harga = "Total harga tidak boleh kurang dari 0";
  }

  return errors;
}
