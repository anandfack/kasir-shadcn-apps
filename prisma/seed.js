const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const pegawaiData = require("./data/pegawai.data");
const satuanData = require("./data/satuan.data");
const kategoriData = require("./data/kategori.data");
const supplierData = require("./data/supplier.data");
const produkData = require("./data/produk.data");
const dataHarga = require("./data/harga.data");

async function main() {
  const passwordPlanain = "admin123";
  const hashedPassword = await bcrypt.hash(passwordPlanain, 10);

  console.log("🌱 Seeding Pegawai...");
  await prisma.pegawai.createMany({
    data: pegawaiData,
    skipDuplicates: true,
  });

  console.log("🌱 Seeding Satuan...");
  await prisma.satuan.createMany({
    data: satuanData,
    skipDuplicates: true,
  });

  console.log("🌱 Seeding Kategori...");
  await prisma.kategori.createMany({
    data: kategoriData,
    skipDuplicates: true,
  });

  console.log("🌱 Seeding Supplier...");
  await prisma.supplier.createMany({
    data: supplierData,
    skipDuplicates: true,
  });

  console.log("🌱 Seeding Produk...");
  await prisma.produk.createMany({
    data: produkData,
    skipDuplicates: true,
  });

  console.log("🌱 Seeding Harga...");
  await prisma.harga.createMany({
    data: dataHarga,
    skipDuplicates: true,
  });

  console.log("Seeding Login Pemakai Admin..");
  await prisma.loginPemakai.createMany({
    data: [
      {
        username: "admin",
        password: hashedPassword,
        role: "admin",
        pegawai_id: 1,
        email: "admin@admin.com",
        verified: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_aktif: true,
      },
    ],
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
