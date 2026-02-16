const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  /*
  ============================
  PEGAWAI
  ============================
  */

  console.log("🌱 Pegawai");

  await prisma.pegawai.createMany({
    data: [
      {
        nip_pegawai: "PGW001",
        nama_pegawai: "Admin Store",
        tanggal_lahir: new Date("1998-02-10"),
        jenis_kelamin: "L",
        alamat_pegawai: "Sidoarjo",
        nomor_telepon_pegawai: "08123456789",
        email_pegawai: "admin@store.com",
        jabatan_pegawai: "Store Manager",
        is_aktif: true,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  LOGIN
  ============================
  */

  await prisma.loginPemakai.createMany({
    data: [
      {
        username: "admin",
        password: hashedPassword,
        role: "superadmin",
        pegawai_id: 1,
        email: "admin@store.com",
        verified: true,
        is_aktif: true,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  SATUAN
  ============================
  */

  console.log("🌱 Satuan");

  await prisma.satuan.createMany({
    data: [
      { kode_satuan: "PCS", nama_satuan: "Pcs" },
      { kode_satuan: "LUSIN", nama_satuan: "Lusin" },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  KATEGORI
  ============================
  */

  console.log("🌱 Kategori Pakaian");

  await prisma.kategori.createMany({
    data: [
      { kode_kategori: "KAT001", nama_kategori: "Kaos" },
      { kode_kategori: "KAT002", nama_kategori: "Kemeja" },
      { kode_kategori: "KAT003", nama_kategori: "Jaket" },
      { kode_kategori: "KAT004", nama_kategori: "Celana" },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  SUPPLIER
  ============================
  */

  console.log("🌱 Supplier Garment");

  await prisma.supplier.createMany({
    data: [
      {
        kode_supplier: "SUP001",
        nama_supplier: "CV Garment Nusantara",
        alamat_supplier: "Bandung",
        nomor_telepon_supplier: "08111111111",
        is_aktif: true,
      },
      {
        kode_supplier: "SUP002",
        nama_supplier: "PT Fashion Indo",
        alamat_supplier: "Jakarta",
        nomor_telepon_supplier: "08222222222",
        is_aktif: true,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  PRODUK
  ============================
  */

  console.log("🌱 Produk Pakaian");

  await prisma.produk.createMany({
    data: [
      {
        kode_produk: "TSHIRT001",
        nama_produk: "Kaos Polos Premium",
        kategori_id: 1,
        satuan_produk_id: 1,
        supplier_id: 1,
        is_aktif: true,
      },
      {
        kode_produk: "SHIRT001",
        nama_produk: "Kemeja Flanel",
        kategori_id: 2,
        satuan_produk_id: 1,
        supplier_id: 2,
        is_aktif: true,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  PRODUK VARIANT
  ============================
  */

  console.log("🌱 Variant Pakaian");

  await prisma.produkVariant.createMany({
    data: [
      // KAOS
      {
        produk_id: 1,
        sku: "TSHIRT001-M-HITAM",
        ukuran: "M",
        warna: "Hitam",
        satuan_produk_id: 1,
      },
      {
        produk_id: 1,
        sku: "TSHIRT001-L-HITAM",
        ukuran: "L",
        warna: "Hitam",
        satuan_produk_id: 1,
      },
      {
        produk_id: 1,
        sku: "TSHIRT001-M-PUTIH",
        ukuran: "M",
        warna: "Putih",
        satuan_produk_id: 1,
      },

      // KEMEJA
      {
        produk_id: 2,
        sku: "SHIRT001-L-MERAH",
        ukuran: "L",
        warna: "Merah",
        satuan_produk_id: 1,
      },
      {
        produk_id: 2,
        sku: "SHIRT001-XL-MERAH",
        ukuran: "XL",
        warna: "Merah",
        satuan_produk_id: 1,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  HARGA
  ============================
  */

  console.log("🌱 Harga Produk");

  await prisma.harga.createMany({
    data: [
      {
        produk_id: 1,
        harga_beli: 45000,
        harga_jual: 75000,
      },
      {
        produk_id: 2,
        harga_beli: 90000,
        harga_jual: 140000,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  STOK PRODUK
  ============================
  */

  console.log("🌱 Stok Produk");

  await prisma.stok.createMany({
    data: [
      {
        produk_id: 1,
        jumlah_stok: 100,
        minimal_stok: 10,
        maksimal_stok: 300,
      },
      {
        produk_id: 2,
        jumlah_stok: 80,
        minimal_stok: 10,
        maksimal_stok: 200,
      },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  STOK VARIANT
  ============================
  */

  console.log("🌱 Stok Variant");

  await prisma.stokVariant.createMany({
    data: [
      {
        produk_variant_id: 1,
        jumlah_stok: 30,
        minimal_stok: 5,
        maksimal_stok: 100,
      },
      {
        produk_variant_id: 2,
        jumlah_stok: 25,
        minimal_stok: 5,
        maksimal_stok: 100,
      },
      {
        produk_variant_id: 3,
        jumlah_stok: 20,
        minimal_stok: 5,
        maksimal_stok: 100,
      },
      {
        produk_variant_id: 4,
        jumlah_stok: 15,
        minimal_stok: 5,
        maksimal_stok: 100,
      },
      {
        produk_variant_id: 5,
        jumlah_stok: 10,
        minimal_stok: 5,
        maksimal_stok: 100,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed Master Pakaian Selesai");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
