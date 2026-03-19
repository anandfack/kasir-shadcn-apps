import jsonResponse from "@/lib/jsonResponse";
import {
  createPenerimaanPoRepo,
  getDetailPenerimaanPoRepo,
  getPenerimaanPoRepo,
} from "./penerimaanpo.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import { validateCreatePenerimaanPo } from "./penerimaanpo.validation";

export async function getPenerimaanPo(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { searchParams } = new URL(req.url);
    const withotuInvoicePenerimaan = searchParams.get(
      "without_invoice_penerimaan",
    );

    const whereCondition = {
      deleted_at: null,
      ...(withotuInvoicePenerimaan === "true" && {
        invoicePenerimaans: {
          none: {},
        },
      }),
    };

    const penerimaanPo = await getPenerimaanPoRepo(whereCondition);

    return jsonResponse(
      {
        data: penerimaanPo,
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

export async function createPenerimaanPo(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreatePenerimaanPo(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 400);
    }

    const penerimaanPo = await createPenerimaanPoRepo(data, auth);

    return jsonResponse(
      {
        data: penerimaanPo,
        message: "Penerimaan po berhasil ditambahkan",
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

export async function getDetailPenerimaanPo(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = parseInt(params.id);

    const penerimaanPo = await getDetailPenerimaanPoRepo(id);

    return jsonResponse(
      {
        data: penerimaanPo,
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
