export const formatTanggal = (dateString, options = {}) => {
  if (!dateString) return "-";

  const {
    withTime = true,
    separator = ".",
    timezone = "Asia/Jakarta",
  } = options;

  const date = new Date(dateString);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  }).format(date);

  if (!withTime) return tanggal;

  const jam = date
    .toLocaleString("id-ID", {
      hour: "2-digit",
      hour12: false,
      timeZone: timezone,
    })
    .padStart(2, "0");

  const menit = date
    .toLocaleString("id-ID", { minute: "2-digit", timeZone: timezone })
    .padStart(2, "0");

  return `${tanggal} ${jam}${separator}${menit}`;
};

export const formatTanggalTanpaJam = (dateString, options = {}) => {
  return formatTanggal(dateString, {
    ...options,
    withTime: false,
  });
};
