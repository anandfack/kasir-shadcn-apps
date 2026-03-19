import jsonResponse from "@/lib/jsonResponse";
import { validateCreateReturPenerimaan } from "./returpenerimaan.validation";
import { verifyAuth } from "@/lib/verifyAuth";
import { createReturPenerimaanRepo } from "./returpenerimaan.repository";

export async function createReturPenerimaan(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateReturPenerimaan(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ errors }, 422);
    }

    const returPenerimaan = await createReturPenerimaanRepo(data);

    return jsonResponse(
      {
        data: returPenerimaan,
        message: "Retur penerimaan berhasil ditambahkan",
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
