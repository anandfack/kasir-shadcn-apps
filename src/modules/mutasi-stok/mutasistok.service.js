import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { mutasiStokRepo } from "./mutasiStok.repository";

export async function getMutasiStok(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const produkId = parseInt(params.id);

    const mutasiStok = await mutasiStokRepo(produkId);

    return jsonResponse({
      message: "OK",
      data: mutasiStok,
    });
  } catch (error) {
    console.log(error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
