import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const productsCategory = await prisma.kategori.findMany();
    return new Response(JSON.stringify(productsCategory), {
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

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     const kode_kategori = formData.get("kode_kategori");
//     const nama_kategori = formData.get("nama_kategori");
//     const created_at = formData.get("created_at");
//     const updated_at = formData.get("updated_at");

//     if (!kode_kategori || !nama_kategori || !created_at || !updated_at) {
//       return new Response(
//         JSON.stringify({
//           error:
//             "kode_kategori, nama_kategori, created_at, dan updated_at harus diisi",
//         }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const newCategory = await prisma.kategori.create({
//       data: {
//         kode_kategori,
//         nama_kategori,
//         created_at: new Date(created_at),
//         updated_at: new Date(updated_at),
//       },
//     });

//     return new Response(JSON.stringify(newCategory), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json(); // Membaca data JSON dari request body
    const { kode_kategori, nama_kategori, created_at, updated_at } = body;

    // Validasi data
    if (!kode_kategori || !nama_kategori) {
      return new Response(
        JSON.stringify({
          error: "kode_kategori dan nama_kategori harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simpan ke database
    const newCategory = await prisma.kategori.create({
      data: {
        kode_kategori,
        nama_kategori,
        created_at: created_at ? new Date(created_at) : new Date(),
        updated_at: updated_at ? new Date(updated_at) : new Date(),
      },
    });

    return new Response(JSON.stringify(newCategory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
