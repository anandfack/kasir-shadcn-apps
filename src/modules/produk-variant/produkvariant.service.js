import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createProdukVariantRepo,
  deleteProdukVariantRepo,
  produkVariantRepo,
  updateProdukVariantRepo,
} from "./produkvariant.repository";
import {
  validateProdukVariant,
  validateUpdateProdukVariant,
} from "./produkvariant.validation";

export async function getProdukVariant(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const produkVariant = await produkVariantRepo();

    return jsonResponse({
      message: "OK",
      data: produkVariant,
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

export async function createProdukVariant(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }
    const data = await req.json();

    const errors = validateProdukVariant(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const produkVariant = await createProdukVariantRepo(data);

    return jsonResponse(
      {
        message: "Berhasil menambahkan produk variant",
        data: produkVariant,
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

export async function updateProdukVariant(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const data = await req.json();

    const errors = validateUpdateProdukVariant(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        409,
      );
    }

    const produkVariant = await updateProdukVariantRepo(Number(id), data);

    return jsonResponse(
      {
        message: "Berhasil update produk variant",
        data: produkVariant,
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

export async function deleteProdukVariant(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }
    const { id } = params;

    const produkVariant = await deleteProdukVariantRepo(Number(id));

    return jsonResponse(
      {
        message: "Berhasil menghapus produk variant",
        data: produkVariant,
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
