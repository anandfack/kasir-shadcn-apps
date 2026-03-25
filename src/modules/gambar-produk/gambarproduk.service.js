import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { getGambarProdukRepo } from "./gambarproduk.repository";

export async function getGambarProduk(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const produkId = parseInt(params.id);

    const gambarProduk = await getGambarProdukRepo(produkId);

    return jsonResponse(
      {
        data: gambarProduk,
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
