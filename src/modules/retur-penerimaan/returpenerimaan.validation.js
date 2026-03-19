export async function validateCreateReturPenerimaan(data) {
  const errors = {};

  if (!data.penerimaan_id || isNaN(Number(data.penerimaan_id))) {
    errors.penerimaan_id = "Pembelian tidak valid";
  }

  if (
    data.total_harga === undefined ||
    data.total_harga === null ||
    isNaN(Number(data.total_harga)) ||
    Number(data.total_harga) < 0
  ) {
    errors.total_harga = "Total harga tidak valid";
  }

  if (!Array.isArray(data.details_retur) || data.details_retur.length === 0) {
    errors.details_retur = "Detail retur wajib diisi";
  }

  return errors;
}
