import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const detailPembelianProduk = await prisma.pembelian.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        supplier: true,
        DetailPembelian: {
          include: {
            produk: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(detailPembelianProduk), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
