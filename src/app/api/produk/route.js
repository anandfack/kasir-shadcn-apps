import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk setiap metode
export async function GET(req) {
  try {
    const products = await prisma.produk.findMany();
    return new Response(JSON.stringify(products), {
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

// async function handlePost(req, res) {
//   const { name, email } = req.body;
//   try {
//     const user = await prisma.user.create({
//       data: { name, email },
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     await handleGet(req, res);
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
