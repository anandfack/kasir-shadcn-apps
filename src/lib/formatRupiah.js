export const formatRupiah = (value, options = {}) => {
  const { withSymbol = true, fractionDigits = 2 } = options;

  if (value === null || value === undefined || value === "") return "-";

  return new Intl.NumberFormat("id-ID", {
    style: withSymbol ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number(value));
};
