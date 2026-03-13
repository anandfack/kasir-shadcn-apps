import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createProdukRepo,
  deleteProdukRepo,
  findProduk,
  updateProdukRepo,
} from "./produk.reprository";
import { validateProduk } from "./produk.validation";

export async function getProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { searchParams } = new URL(req.url);
    const withoutPrice = searchParams.get("without_price");

    let whereCondition = {
      deleted_at: null,
    };

    if (withoutPrice === "true") {
      whereCondition.Harga = {
        none: {
          deleted_at: null,
        },
      };
    }

    const data = await findProduk(whereCondition);
    return jsonResponse(
      {
        message: "OK",
        data,
      },
      200,
    );
  } catch (error) {
    console.log("Error: ", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}

export async function createProduk(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = validateProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const produk = await createProdukRepo(data);

    return jsonResponse(
      {
        message: "Produk berhasil ditambahkan",
        data: produk,
      },
      201,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}

export async function updateProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse(
        {
          message: auth.error,
        },
        401,
      );
    }

    const { id } = params;

    const data = await req.json();

    const errors = validateProduk(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const produk = await updateProdukRepo(Number(id), data);

    return jsonResponse(
      {
        message: "Produk berhasil diperbarui",
        data: produk,
      },
      200,
    );
  } catch (error) {
    console.log(error);
    jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}

export async function deleteProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const produk = await deleteProdukRepo(Number(id));

    return jsonResponse(
      {
        message: "Produk berhasil dihapus",
        data: produk,
      },
      200,
    );
  } catch (error) {
    console.log(error);
    jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
