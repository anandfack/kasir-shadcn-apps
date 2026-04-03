import jsonResponse from "@/lib/jsonResponse";
import { verifyPublicApiKey } from "@/lib/verifyPublicApiKey";
import { getDetailProductsRepo } from "./products.repository";

export async function getDetailProducts(req, { params }) {
  try {
    verifyPublicApiKey(req);

    const { slug } = params;

    const products = await getDetailProductsRepo(slug);

    return jsonResponse(
      {
        data: products,
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
