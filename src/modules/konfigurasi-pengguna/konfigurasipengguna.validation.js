export async function validateCreateUser(data) {
  const errors = {};
  if (!data.pegawai_id) {
    errors.pegawai_id = "Pegawai wajib diisi";
  } else if (isNaN(Number(data.pegawai_id))) {
    errors.pegawai_id = "Pegawai tidak valid";
  }

  if (!data.username || data.username.trim() === "") {
    errors.username = "Username wajib diisi";
  }
  if (!data.password || data.password.trim() === "") {
    errors.password = "Password wajib diisi";
  }
  if (data.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
  } else if (data.password.length > 20) {
    errors.password = "Password maksimal 20 karakter";
  }
  if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 huruf besar";
  }
  if (!/[a-z]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 huruf kecil";
  }
  if (!/\d/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 angka";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 simbol khusus";
  }
  if (/\s/.test(data.password)) {
    errors.password = "Password tidak boleh mengandung spasi";
  }

  if (!data.role_ids || data.role_ids.length === 0) {
    errors.role_ids = "Role wajib diisi";
  }
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email wajib diisi";
  }

  return errors;
}

export async function validateUpdateUser(data) {
  const errors = {};
  if (!data.pegawai_id) {
    errors.pegawai_id = "Pegawai wajib diisi";
  } else if (isNaN(Number(data.pegawai_id))) {
    errors.pegawai_id = "Pegawai tidak valid";
  }

  if (!data.username || data.username.trim() === "") {
    errors.username = "Username wajib diisi";
  }

  if (!data.role_ids || data.role_ids.length === 0) {
    errors.role_ids = "Role wajib diisi";
  }
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email wajib diisi";
  }

  return errors;
}

export async function validateResetPassword(data) {
  const errors = {};
  if (data.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
  } else if (data.password.length > 20) {
    errors.password = "Password maksimal 20 karakter";
  }
  if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 huruf besar";
  }
  if (!/[a-z]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 huruf kecil";
  }
  if (!/\d/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 angka";
  }
  if (!/[!@#$%^&*(),.?":{}|<>-]/.test(data.password)) {
    errors.password = "Password harus mengandung setidaknya 1 simbol khusus";
  }
  if (/\s/.test(data.password)) {
    errors.password = "Password tidak boleh mengandung spasi";
  }

  if (data.password !== data.confirm_password) {
    errors.confirm_password = "Password tidak cocok";
  }

  return errors;
}
