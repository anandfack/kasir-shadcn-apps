import jsonResponse from "@/lib/jsonResponse";
import {
  createSatuanProdukRepo,
  deleteSatuanProdukRepo,
  getSatuanProdukRepo,
  updateSatuanProdukRepo,
} from "./satuanproduk.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  validateCreateSatuanProduk,
  validateUpdateSatuanProduk,
} from "./satuanproduk.validation";

export async function getSatuanProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const satuanProduk = await getSatuanProdukRepo();

    return jsonResponse({
      message: "OK",
      data: satuanProduk,
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

export async function createSatuanProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }
    const data = await req.json();

    const errors = await validateCreateSatuanProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const satuanProduk = await createSatuanProdukRepo(data);
    return jsonResponse(
      {
        message: "Berhasil menambahkan satuan produk",
        data: satuanProduk,
      },
      201,
    );
  } catch (error) {
    console.log(error);
    jsonResponse(
      {
        message: "Internal server error",
      },
      500,
    );
  }
}

export async function updateSatuanProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdateSatuanProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const satuanProduk = await updateSatuanProdukRepo(Number(id), data);

    return jsonResponse(
      {
        message: "Berhasil update satuan produk",
        data: satuanProduk,
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

export async function deleteSatuanProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const satuanProduk = await deleteSatuanProdukRepo(id);
    return jsonResponse(
      {
        message: "Berhasil hapus satuan produk",
        data: satuanProduk,
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
