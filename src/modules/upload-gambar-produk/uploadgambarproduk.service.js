import jsonResponse from "@/lib/jsonResponse";
import { createGambarProdukRepo } from "./uploadgambarproduk.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import { writeFile } from "fs/promises";
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

    const urls = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + file.name;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);

      urls.push(`/uploads/${fileName}`);
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
