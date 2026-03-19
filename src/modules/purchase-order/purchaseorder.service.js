import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  createPurchaseOrderRepo,
  getDetailPurchaseOrderRepo,
  getPurchaseOrderRepo,
} from "./purchaseorder.repository";
import { validateCreatePurchaseOrder } from "./purchaseorder.validation";

export async function getPurchaseOrder(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const purchaseOrder = await getPurchaseOrderRepo();

    const result = purchaseOrder.map((po) => {
      const totalQtyPO = po.details.reduce(
        (sum, d) => sum + d.jumlah_produk,
        0,
      );

      const totalQtyDiterima = po.details.reduce(
        (sum, d) => sum + d.qty_diterima,
        0,
      );

      const progressPersen =
        totalQtyPO === 0
          ? 0
          : Math.round((totalQtyDiterima / totalQtyPO) * 100);

      return {
        ...po,
        total_qty_po: totalQtyPO,
        total_qty_diterima: totalQtyDiterima,
        progress: `${totalQtyDiterima} / ${totalQtyPO}`,
        progress_persen: progressPersen,
      };
    });

    return jsonResponse(
      {
        data: result,
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

export async function createPurchaseOrder(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreatePurchaseOrder(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 422);
    }

    const purchaseOrder = await createPurchaseOrderRepo(data, auth);

    return jsonResponse(
      {
        data: purchaseOrder,
        message: "Purchase order berhasil ditambahkan",
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

export async function getDetailPurchaseOrder(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = parseInt(params.id);

    const purchaseOrder = await getDetailPurchaseOrderRepo(id);

    return jsonResponse(
      {
        data: purchaseOrder,
        message: "OK",
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
