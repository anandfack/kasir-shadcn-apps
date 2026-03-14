import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { mutasiStokVariantRepo } from "./mutasistokvariant.repository";

export async function getMutasiStokVariant(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const produkVariantId = parseInt(params.id);

    const mutasiStokVariant = await mutasiStokVariantRepo(produkVariantId);
    return jsonResponse(
      {
        message: "OK",
        data: mutasiStokVariant,
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
