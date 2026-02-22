export async function generateDocumentNumber({
  tx,
  model,
  field,
  prefix,
  tanggal,
}) {
  const date = new Date(tanggal);

  const dateString = date.toISOString().slice(0, 10).replaceAll("-", "");

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

export async function newGenerateDocumentNumber({ tx, prefix, tanggal }) {
  const dateString = new Date(tanggal)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const docCounter = await tx.documentCounter.upsert({
    where: { unique_prefix_date: { prefix, date: dateString } }, // ← pakai nama unique key
    update: { counter: { increment: 1 } },
    create: { prefix, date: dateString, counter: 1 },
  });

  return `${prefix}-${dateString}-${String(docCounter.counter).padStart(6, "0")}`;
}
