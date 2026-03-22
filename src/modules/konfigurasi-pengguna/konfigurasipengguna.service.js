import jsonResponse from "@/lib/jsonResponse";
import {
  createUserRepo,
  deleteUserRepo,
  getKonfigurasiPenggunaRepo,
  resetPasswordRepo,
  updateUserRepo,
} from "./konfigurasipengguna.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  validateCreateUser,
  validateResetPassword,
  validateUpdateUser,
} from "./konfigurasipengguna.validation";

export async function getKonfigurasiPengguna(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const konfigurasiPengguna = await getKonfigurasiPenggunaRepo();

    return jsonResponse(
      {
        data: konfigurasiPengguna,
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

export async function createUser(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateUser(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const konfigurasiPengguna = await createUserRepo(data);

    return jsonResponse(
      {
        data: konfigurasiPengguna,
        message: "Konfigurasi pengguna berhasil ditambahkan",
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

export async function updateUser(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdateUser(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const updateUser = await updateUserRepo(id, data);

    return jsonResponse(
      {
        data: updateUser,
        message: "User pengguna berhasil diubah",
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

export async function deleteUser(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const deleteUser = await deleteUserRepo(id);

    return jsonResponse(
      {
        data: deleteUser,
        message: "Internal server error",
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

export async function resetPassword(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateResetPassword(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const resetPassword = await resetPasswordRepo(id, data);

    return jsonResponse(
      {
        data: resetPassword,
        message: "Password berhasil direset",
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
