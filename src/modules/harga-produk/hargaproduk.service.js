import jsonResponse from "@/lib/jsonResponse";
import {
  createHargaProdukRepo,
  deleteHargaProdukRepo,
  getHargaProdukRepo,
  updateHargaProdukRepo,
} from "./hargaproduk.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  validateCreateHargaProduk,
  validateUpdateHargaProduk,
} from "./hargaproduk.validation";
import { deleteCacheByPattern, withCacheRequest } from "@/lib/cache";

export async function getHargaProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const hargaProduk = await withCacheRequest(
      req,
      () => getHargaProdukRepo(),
      {
        ttl: 60,
        module: "harga-produk",
      },
    );

    return jsonResponse(
      {
        message: "OK",
        data: hargaProduk,
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

export async function createHargaProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateHargaProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const hargaProduk = await createHargaProdukRepo(data);

    await deleteCacheByPattern("kasir:harga-produk*");

    return jsonResponse(
      {
        message: "Berhasil menambahkan harga produk",
        data: hargaProduk,
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

export async function updateHargaProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdateHargaProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const hargaProduk = await updateHargaProdukRepo(Number(id), data);

    await deleteCacheByPattern("kasir:harga-produk*");

    return jsonResponse(
      {
        message: "Berhasil update harga produk",
        data: hargaProduk,
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

export async function deleteHargaProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const hargaProduk = await deleteHargaProdukRepo(id);

    await deleteCacheByPattern("kasir:harga-produk*");

    return jsonResponse(
      {
        message: "Berhasil hapus harga produk",
        data: hargaProduk,
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
