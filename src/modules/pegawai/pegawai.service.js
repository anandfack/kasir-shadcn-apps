import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createPegawaiRepo,
  deletePegawaiRepo,
  getDetailPegawaiRepo,
  getPegawaiRepo,
  updatePegawaiRepo,
} from "./pegawai.repository";
import {
  validateCreatePegawai,
  validateUpdatePegawai,
} from "./pegawai.validation";
import { deleteCacheByPattern, withCacheRequest } from "@/lib/cache";

export async function getPegawai(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { searchParams } = new URL(req.url);
    const withoutLogin = searchParams.get("without_login");

    let whereCondition = {
      deleted_at: null,
    };

    if (withoutLogin === "true") {
      whereCondition.OR = [
        { LoginPemakai: null },
        { LoginPemakai: { deleted_at: { not: null } } },
      ];
    }

    const pegawai = await withCacheRequest(
      req,
      () => getPegawaiRepo(whereCondition),
      {
        ttl: 60,
        module: "pegawai",
      },
    );

    return jsonResponse(
      {
        data: pegawai,
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

export async function createPegawai(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }
    const data = await req.json();

    const errors = await validateCreatePegawai(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const pegawai = await createPegawaiRepo(data);

    return jsonResponse(
      {
        data: pegawai,
        message: "Pegawai berhasil ditambahkan",
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

export async function getDetailPegawai(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const pegawaiId = parseInt(params.id);

    const pegawai = await withCacheRequest(
      req,
      () => getDetailPegawaiRepo(pegawaiId),
      {
        ttl: 60,
        module: "pegawai",
      },
    );

    return jsonResponse(
      {
        data: pegawai,
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

export async function updatePegawai(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdatePegawai(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const pegawai = await updatePegawaiRepo(id, data);

    await deleteCacheByPattern("kasir:pegawai*");

    return jsonResponse(
      {
        data: pegawai,
        message: "Pegawai berhasil diupdate",
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

export async function deletePegawai(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;

    const pegawai = await deletePegawaiRepo(id);

    await deleteCacheByPattern("kasir:pegawai*");

    return jsonResponse(
      {
        data: pegawai,
        message: "Pegawai berhasil dihapus",
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
