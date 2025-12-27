import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { minimal_stok, maksimal_stok } = body;

    const minimal = Number(minimal_stok);
    const maksimal = Number(maksimal_stok);

    if (Number.isNaN(minimal) || Number.isNaN(maksimal)) {
      return new Response(
        JSON.stringify({
          error: "minimal stok dan maksimal stok harus berupa angka",
        }),
        { status: 400 }
      );
    }

    const updateStockProduk = await prisma.stok.update({
      where: { id: parseInt(id, 10) },
      data: {
        minimal_stok: minimal,
        maksimal_stok: maksimal,
        updated_at: new Date(),
      },
    });
    return new Response(JSON.stringify(updateStockProduk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
