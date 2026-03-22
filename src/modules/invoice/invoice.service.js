import jsonResponse from "@/lib/jsonResponse";
import {
  batalPembayaranInvoiceRepo,
  createInvoiceRepo,
  getDetailInvoiceRepo,
  getHistoryPembayaranInvoiceRepo,
  getInvoiceRepo,
  pembayaranInvoiceRepo,
} from "./invoice.repository";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  validateBatalPembayaranInvoice,
  validateCreateInvoice,
  validatePembayaranInvoice,
} from "./invoice.validation";

export async function getInvoice(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const invoice = await getInvoiceRepo();

    return jsonResponse(
      {
        data: invoice,
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

export async function createInvoice(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validateCreateInvoice(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validasi gagal", errors }, 400);
    }
    const invoice = await createInvoiceRepo(data, auth);

    return jsonResponse(
      {
        data: invoice,
        message: "Invoice berhasil ditambahkan",
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

export async function getDetailInvoice(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = parseInt(params.id);

    const invoice = await getDetailInvoiceRepo(id);

    return jsonResponse(
      {
        data: invoice,
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

export async function getHistoryPembayaranInvoice(req, { params }) {
  const auth = verifyAuth(req);
  if (auth.error) {
    return jsonResponse({ message: auth.error }, 401);
  }

  const id = Number(params.id);

  const getHistoryPembayaranInvoice = await getHistoryPembayaranInvoiceRepo(id);

  return jsonResponse(
    {
      data: getHistoryPembayaranInvoice,
      message: "OK",
    },
    200,
  );
}

export async function pembayaranInvoice(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const data = await req.json();

    const errors = await validatePembayaranInvoice(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const pembayaranInvoice = await pembayaranInvoiceRepo(data, auth);

    return jsonResponse(
      {
        data: pembayaranInvoice,
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

export async function batalPembayaranInvoice(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = Number(params.id);

    const errors = await validateBatalPembayaranInvoice(id);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const batalPembayaranInvoice = await batalPembayaranInvoiceRepo(id);

    return jsonResponse(
      {
        data: batalPembayaranInvoice,
        message: "Pembayaran berhasil dibatalkan",
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
