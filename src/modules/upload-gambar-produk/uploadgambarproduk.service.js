import jsonResponse from "@/lib/jsonResponse";
import {
  createGambarProdukRepo,
  getProdukSlugById,
} from "./uploadgambarproduk.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function createGambarProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const formData = await req.formData();

    for (let pair of formData.entries()) {
      console.log("FORMDATA:", pair[0], pair[1]);
    }

    const produkId = formData.get("produk_id");
    const files = formData.getAll("files");

    const produk = await getProdukSlugById(Number(produkId));

    if (!produk) {
      return jsonResponse({ message: "Produk tidak ditemukan" }, 404);
    }

    const slug = produk.slug;

    const urls = [];

    const uploadDir = path.join(process.cwd(), "public/uploads", slug);

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      if (file.type !== "image/webp") {
        return jsonResponse({ message: "File harus berformat webp" }, 400);
      }

      if (file.size > 2 * 1024 * 1024) {
        return jsonResponse({ message: "Ukuran file maksimal 2MB" }, 400);
      }

      if (!file.name.toLowerCase().endsWith(".webp")) {
        return jsonResponse({ message: "File harus berekstensi webp" }, 400);
      }
    }

    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `img-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.webp`;

      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      urls.push(`/uploads/${slug}/${fileName}`);
    }
    const gambarProduk = await createGambarProdukRepo(produkId, urls);

    return jsonResponse(
      {
        data: gambarProduk,
        message: "Gambar berhasil diupload",
      },
      200,
    );
  } catch (error) {
    console.log(error);
    return jsonResponse(
      {
        message: "Internal server error",
      },
      500,
    );
  }
}
