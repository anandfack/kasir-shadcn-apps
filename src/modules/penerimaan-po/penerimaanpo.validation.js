export async function validateCreatePenerimaanPo(data) {
  const errors = {};
  if (!data.purchase_order_id) {
    errors.purchase_order_id = "Purchase order wajib diisi";
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

  if (!data.details_penerimaan || data.details_penerimaan.length === 0) {
    errors.details = "Detail penerimaan wajib diisi";
  }

  if (!data.tanggal_penerimaan || data.tanggal_penerimaan.trim() === "") {
    errors.tanggal_penerimaan = "Tanggal penerimaan wajib diisi";
  }
  if (!data.tanggal_faktur || data.tanggal_faktur.trim() === "") {
    errors.tanggal_faktur = "Tanggal faktur wajib diisi";
  }
  if (!data.tanggal_surat_jalan || data.tanggal_surat_jalan.trim() === "") {
    errors.tanggal_surat_jalan = "Tanggal surat jalan wajib diisi";
  }
  if (!data.nomor_faktur || data.nomor_faktur.trim() === "") {
    errors.nomor_faktur = "Tanggal surat jalan wajib diisi";
  }
  if (!data.nomor_surat_jalan || data.nomor_surat_jalan.trim() === "") {
    errors.nomor_surat_jalan = "Tanggal surat jalan wajib diisi";
  }

  return errors;
}
