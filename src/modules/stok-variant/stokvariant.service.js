import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  adjustStokVariantRepo,
  getStokVariantRepo,
  updateStokVariantRepo,
} from "./stokvariant.repository";
import {
  validateAdjustStokVariant,
  validateUpdateStokVariant,
} from "./stokvariant.validation";

export async function getStokVariant(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    function getStatus(stok) {
      if (!stok) return "Belum Diatur";
      if (stok.jumlah_stok <= 0) return "Habis";
      if (stok.jumlah_stok <= stok.minimal_stok) return "Menipis";
      if (stok.jumlah_stok >= stok.maksimal_stok) return "Berlebih";
      return "Aman";
    }

    const produkVariant = await getStokVariantRepo();

    const result = produkVariant.map((item) => {
      const stok = item.stok ?? null;

      return {
        id: item.id,
        sku: item.sku,
        warna: item.warna,
        ukuran: item.ukuran,

        // PRODUK
        produk_id: item?.produk?.id ?? null,
        nama_produk: item?.produk?.nama_produk ?? null,

        jumlah_stok: stok?.jumlah_stok ?? null,
        minimal_stok: stok?.minimal_stok ?? null,
        maksimal_stok: stok?.maksimal_stok ?? null,

        status: getStatus(stok),
        terakhir_update: stok?.updated_at ?? null,

        has_stok: !!stok,
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

export async function updateStokVariant(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const { id } = params;
    const data = await req.json();

    const errors = await validateUpdateStokVariant(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const stokVariant = await updateStokVariantRepo(id, data);

    return jsonResponse(
      {
        data: stokVariant,
        message: "Stok variant berhasil diperbarui",
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

export async function adjustStokVariant(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const user = auth.user;

    if (!user?.pegawai_id) {
      return jsonResponse(
        { message: "Pegawai tidak terhubung dengan akun login" },
        403,
      );
    }

    const data = await req.json();

    const errors = await validateAdjustStokVariant(data);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        {
          message: "Validation Error",
          errors,
        },
        400,
      );
    }

    const stokVariant = await adjustStokVariantRepo(data, auth);

    return jsonResponse(
      {
        data: stokVariant,
        message: "Stok variant berhasil disesuaikan",
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
