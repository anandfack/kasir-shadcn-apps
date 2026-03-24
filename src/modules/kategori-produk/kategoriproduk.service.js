import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createKategoriProdukRepo,
  deleteKategoriProdukRepo,
  getKategoriProdukRepo,
  updateKategoriProdukRepo,
} from "./kategoriproduk.repository";
import {
  validateCreateKategoriProduk,
  validateUpdateKategoriProduk,
} from "./kategoriproduk.validation";
import { deleteCacheByPattern, withCacheRequest } from "@/lib/cache";

export async function getKategoriProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const kategoriProduk = await withCacheRequest(
      req,
      () => getKategoriProdukRepo(),
      {
        ttl: 60,
        module: "kategori-produk",
      },
    );

    return jsonResponse(
      {
        message: "OK",
        data: kategoriProduk,
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

export async function createKategoriProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateKategoriProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const kategoriProduk = await createKategoriProdukRepo(data);

    await deleteCacheByPattern("kasir:kategori-produk*");

    return jsonResponse({
      message: "Berhasil menambahkan kategori produk",
      data: kategoriProduk,
    });
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

export async function updateKategoriProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdateKategoriProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation error",
          errors,
        },
        400,
      );
    }

    const kategoriProduk = await updateKategoriProdukRepo(Number(id), data);

    await deleteCacheByPattern("kasir:kategori-produk*");

    return jsonResponse(
      {
        message: "Berhasil update kategori produk",
        date: kategoriProduk,
      },
      201,
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

export async function deleteKategoriProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const kategoriProduk = await deleteKategoriProdukRepo(id);

    await deleteCacheByPattern("kasir:kategori-produk*");

    return jsonResponse(
      {
        message: "Berhasil hapus kategori produk",
        data: kategoriProduk,
      },
      201,
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
