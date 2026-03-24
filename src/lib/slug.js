import { prisma } from "@/lib/prisma";

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // hapus karakter aneh
    .replace(/\s+/g, "-") // spasi → -
    .replace(/-+/g, "-"); // hindari --
}

export async function generateUniqueSlug(model, baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma[model].findFirst({
      where: { slug },
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
