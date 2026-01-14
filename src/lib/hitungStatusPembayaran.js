export function hitungStatusPembayaran(pembayaran = [], totalTagihan = 0) {
  const totalBayar = pembayaran.reduce(
    (sum, p) => sum + Number(p.jumlah_bayar || 0),
    0
  );

  if (totalBayar === 0) return "BELUM_BAYAR";
  if (totalBayar > totalTagihan) return "OVERPAID";
  if (totalBayar >= totalTagihan) return "LUNAS";
  return "SEBAGIAN";
}
