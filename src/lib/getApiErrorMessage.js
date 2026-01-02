export function getApiErrorMessage(error) {
  if (error?.errors && typeof error.errors === "object") {
    return Object.values(error.errors).join(", ");
  }

  if (error?.message) {
    return error.message;
  }

  return "Terjadi kesalahan";
}
