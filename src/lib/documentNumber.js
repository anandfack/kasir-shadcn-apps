export async function generateDocumentNumber({
  tx,
  model,
  field,
  prefix,
  tanggal,
}) {
  const date = new Date(tanggal);

  const dateString = date
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const basePrefix = `${prefix}-${dateString}-`;

  // Cari nomor terakhir
  const lastDoc = await tx[model].findFirst({
    where: {
      [field]: {
        startsWith: basePrefix,
      },
    },
    orderBy: {
      [field]: "desc",
    },
    select: {
      [field]: true,
    },
  });

  let nextNumber = 1;

  if (lastDoc) {
    const lastNumber = parseInt(lastDoc[field].split("-")[2] || "0");
    nextNumber = lastNumber + 1;
  }

  return `${basePrefix}${String(nextNumber).padStart(6, "0")}`;
}
