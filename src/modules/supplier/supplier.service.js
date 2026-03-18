import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createSupplierRepo,
  deleteSupplierRepo,
  getSupplierRepo,
  updateSupplierRepo,
} from "./supplier.repository";
import {
  validateCreateSupplier,
  validateUpdateSupplier,
} from "./supplier.validation";

export async function getSupplier(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const supplier = await getSupplierRepo();

    return jsonResponse(
      {
        data: supplier,
        message: "OK",
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

export async function createSupplier(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateSupplier(data);
    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const supplier = await createSupplierRepo(data);

    return jsonResponse(
      {
        data: supplier,
        message: "Supplier berhasil ditambahakan",
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

export async function updateSupplier(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const data = await req.json();

    const errors = await validateUpdateSupplier(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        409,
      );
    }

    const supplier = await updateSupplierRepo(id, data);

    return jsonResponse(
      {
        data: supplier,
        message: "Data supplier berhasil diperbarui",
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

export async function deleteSupplier(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const supplier = await deleteSupplierRepo(id);

    return jsonResponse(
      {
        data: supplier,
        message: "Supplier berhasil dihapus",
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
