export async function validateCreatePegawai(data) {
  const errors = {};
  if (!data.nip_pegawai || data.nip_pegawai.trim() === "") {
    errors.nip_pegawai = "NIP Pegawai wajib diisi";
  }
  if (!data.nama_pegawai || data.nama_pegawai.trim() === "") {
    errors.nama_pegawai = "Nama Pegawai wajib diisi";
  }
  if (!data.tanggal_lahir || data.tanggal_lahir.trim() === "") {
    errors.tanggal_lahir = "Tanggal Lahir wajib diisi";
  }
  if (!data.jenis_kelamin || data.jenis_kelamin.trim() === "") {
    errors.jenis_kelamin = "Jenis Kelamin wajib diisi";
  }
  if (!data.alamat_pegawai || data.alamat_pegawai.trim() === "") {
    errors.alamat_pegawai = "Alamat Pegawai wajib diisi";
  }
  if (data.nomor_telepon_pegawai !== undefined) {
    const phone = data.nomor_telepon_pegawai?.trim();

    if (!phone) {
      errors.nomor_telepon_pegawai = "Nomor telepon tidak boleh kosong";
    } else if (!/^\d+$/.test(phone)) {
      errors.nomor_telepon_pegawai = "Nomor telepon hanya boleh berisi angka";
    } else if (phone.length < 9 || phone.length > 15) {
      errors.nomor_telepon_pegawai = "Panjang nomor telepon tidak valid";
    } else if (!/^(\+62|62|08)/.test(phone)) {
      errors.nomor_telepon_pegawai =
        "Format nomor telepon Indonesia tidak valid";
    } else if (/^(\d)\1+$/.test(phone)) {
      errors.nomor_telepon_pegawai = "Nomor telepon tidak valid";
    }
  }
  if (!data.email_pegawai || data.email_pegawai.trim() === "") {
    errors.email_pegawai = "Email Pegawai wajib diisi";
  }
  if (!data.jabatan_pegawai || data.jabatan_pegawai.trim() === "") {
    errors.jabatan_pegawai = "Jabatan Pegawai wajib diisi";
  }
  return errors;
}

export async function validateUpdatePegawai(data) {
  const errors = {};
  if (!data.nip_pegawai || data.nip_pegawai.trim() === "") {
    errors.nip_pegawai = "NIP Pegawai wajib diisi";
  }
  if (!data.nama_pegawai || data.nama_pegawai.trim() === "") {
    errors.nama_pegawai = "Nama Pegawai wajib diisi";
  }
  if (!data.tanggal_lahir || data.tanggal_lahir.trim() === "") {
    errors.tanggal_lahir = "Tanggal Lahir wajib diisi";
  }
  if (!data.jenis_kelamin || data.jenis_kelamin.trim() === "") {
    errors.jenis_kelamin = "Jenis Kelamin wajib diisi";
  }
  if (!data.alamat_pegawai || data.alamat_pegawai.trim() === "") {
    errors.alamat_pegawai = "Alamat Pegawai wajib diisi";
  }
  if (data.nomor_telepon_pegawai !== undefined) {
    const phone = data.nomor_telepon_pegawai?.trim();

    if (!phone) {
      errors.nomor_telepon_pegawai = "Nomor telepon tidak boleh kosong";
    } else if (!/^\d+$/.test(phone)) {
      errors.nomor_telepon_pegawai = "Nomor telepon hanya boleh berisi angka";
    } else if (phone.length < 9 || phone.length > 15) {
      errors.nomor_telepon_pegawai = "Panjang nomor telepon tidak valid";
    } else if (!/^(\+62|62|08)/.test(phone)) {
      errors.nomor_telepon_pegawai =
        "Format nomor telepon Indonesia tidak valid";
    } else if (/^(\d)\1+$/.test(phone)) {
      errors.nomor_telepon_pegawai = "Nomor telepon tidak valid";
    }
  }
  if (!data.email_pegawai || data.email_pegawai.trim() === "") {
    errors.email_pegawai = "Email Pegawai wajib diisi";
  }
  if (!data.jabatan_pegawai || data.jabatan_pegawai.trim() === "") {
    errors.jabatan_pegawai = "Jabatan Pegawai wajib diisi";
  }

  return errors;
}
