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
  ROLES
  ============================
  */

  console.log("🌱 Roles & Permissions");

  const roles = await prisma.role.createMany({
    data: [
      { name: "superadmin", label: "Super Admin", description: "Akses penuh ke semua fitur", is_system: true },
      { name: "adminoperasional", label: "Admin Operasional", description: "Mengelola operasional toko", is_system: true },
      { name: "staffgudang", label: "Staff Gudang", description: "Mengelola stok dan gudang", is_system: true },
      { name: "staffpembelian", label: "Staff Pembelian", description: "Mengelola pembelian barang", is_system: true },
      { name: "kasir", label: "Kasir", description: "Melakukan transaksi penjualan", is_system: true },
      { name: "finance", label: "Finance", description: "Mengelola keuangan dan invoice", is_system: true },
      { name: "manager", label: "Manager", description: "Melihat laporan dan monitoring", is_system: true },
    ],
    skipDuplicates: true,
  });

  /*
  ============================
  PERMISSIONS
  ============================
  */

  const permissionData = [
    { name: "dashboard.view", label: "Lihat Dashboard", group: "dashboard", action: "view" },

    { name: "produk.view", label: "Lihat Produk", group: "produk", action: "view" },
    { name: "produk.create", label: "Tambah Produk", group: "produk", action: "create" },
    { name: "produk.edit", label: "Edit Produk", group: "produk", action: "edit" },
    { name: "produk.delete", label: "Hapus Produk", group: "produk", action: "delete" },

    { name: "produk-variant.view", label: "Lihat Variant Produk", group: "produk-variant", action: "view" },
    { name: "produk-variant.create", label: "Tambah Variant Produk", group: "produk-variant", action: "create" },
    { name: "produk-variant.edit", label: "Edit Variant Produk", group: "produk-variant", action: "edit" },
    { name: "produk-variant.delete", label: "Hapus Variant Produk", group: "produk-variant", action: "delete" },

    { name: "harga-produk.view", label: "Lihat Harga Produk", group: "harga-produk", action: "view" },
    { name: "harga-produk.create", label: "Tambah Harga Produk", group: "harga-produk", action: "create" },
    { name: "harga-produk.edit", label: "Edit Harga Produk", group: "harga-produk", action: "edit" },
    { name: "harga-produk.delete", label: "Hapus Harga Produk", group: "harga-produk", action: "delete" },

    { name: "satuan-produk.view", label: "Lihat Satuan Produk", group: "satuan-produk", action: "view" },
    { name: "satuan-produk.create", label: "Tambah Satuan Produk", group: "satuan-produk", action: "create" },
    { name: "satuan-produk.edit", label: "Edit Satuan Produk", group: "satuan-produk", action: "edit" },
    { name: "satuan-produk.delete", label: "Hapus Satuan Produk", group: "satuan-produk", action: "delete" },

    { name: "kategori-produk.view", label: "Lihat Kategori Produk", group: "kategori-produk", action: "view" },
    { name: "kategori-produk.create", label: "Tambah Kategori Produk", group: "kategori-produk", action: "create" },
    { name: "kategori-produk.edit", label: "Edit Kategori Produk", group: "kategori-produk", action: "edit" },
    { name: "kategori-produk.delete", label: "Hapus Kategori Produk", group: "kategori-produk", action: "delete" },

    { name: "supplier.view", label: "Lihat Supplier", group: "supplier", action: "view" },
    { name: "supplier.create", label: "Tambah Supplier", group: "supplier", action: "create" },
    { name: "supplier.edit", label: "Edit Supplier", group: "supplier", action: "edit" },
    { name: "supplier.delete", label: "Hapus Supplier", group: "supplier", action: "delete" },

    { name: "pegawai.view", label: "Lihat Pegawai", group: "pegawai", action: "view" },
    { name: "pegawai.create", label: "Tambah Pegawai", group: "pegawai", action: "create" },
    { name: "pegawai.edit", label: "Edit Pegawai", group: "pegawai", action: "edit" },
    { name: "pegawai.delete", label: "Hapus Pegawai", group: "pegawai", action: "delete" },

    { name: "stock-produk.view", label: "Lihat Stok Produk", group: "stock-produk", action: "view" },

    { name: "stok-variant.view", label: "Lihat Stok Variant", group: "stok-variant", action: "view" },
    { name: "stok-variant.edit", label: "Edit Stok Variant", group: "stok-variant", action: "edit" },

    { name: "mutasi-stok.view", label: "Lihat Mutasi Stok", group: "mutasi-stok", action: "view" },
    { name: "mutasi-stok.create", label: "Tambah Mutasi Stok", group: "mutasi-stok", action: "create" },
    { name: "mutasi-stok.delete", label: "Hapus Mutasi Stok", group: "mutasi-stok", action: "delete" },

    { name: "purchase-order.view", label: "Lihat Purchase Order", group: "purchase-order", action: "view" },
    { name: "purchase-order.create", label: "Tambah Purchase Order", group: "purchase-order", action: "create" },
    { name: "purchase-order.edit", label: "Edit Purchase Order", group: "purchase-order", action: "edit" },
    { name: "purchase-order.delete", label: "Hapus Purchase Order", group: "purchase-order", action: "delete" },
    { name: "purchase-order.approve", label: "Approve Purchase Order", group: "purchase-order", action: "approve" },

    { name: "penerimaan-po.view", label: "Lihat Penerimaan PO", group: "penerimaan-po", action: "view" },
    { name: "penerimaan-po.create", label: "Tambah Penerimaan PO", group: "penerimaan-po", action: "create" },
    { name: "penerimaan-po.edit", label: "Edit Penerimaan PO", group: "penerimaan-po", action: "edit" },
    { name: "penerimaan-po.delete", label: "Hapus Penerimaan PO", group: "penerimaan-po", action: "delete" },

    { name: "retur-penerimaan.view", label: "Lihat Retur Penerimaan", group: "retur-penerimaan", action: "view" },
    { name: "retur-penerimaan.create", label: "Tambah Retur Penerimaan", group: "retur-penerimaan", action: "create" },
    { name: "retur-penerimaan.edit", label: "Edit Retur Penerimaan", group: "retur-penerimaan", action: "edit" },
    { name: "retur-penerimaan.delete", label: "Hapus Retur Penerimaan", group: "retur-penerimaan", action: "delete" },

    { name: "invoice.view", label: "Lihat Invoice", group: "invoice", action: "view" },
    { name: "invoice.create", label: "Tambah Invoice", group: "invoice", action: "create" },
    { name: "invoice.edit", label: "Edit Invoice", group: "invoice", action: "edit" },
    { name: "invoice.delete", label: "Hapus Invoice", group: "invoice", action: "delete" },
    { name: "invoice.bayar", label: "Bayar Invoice", group: "invoice", action: "bayar" },

    { name: "konfigurasi-pengguna.view", label: "Lihat User & Role", group: "konfigurasi-pengguna", action: "view" },
    { name: "konfigurasi-pengguna.edit", label: "Edit User", group: "konfigurasi-pengguna", action: "edit" },

    { name: "roles.view", label: "Lihat Daftar Role", group: "roles", action: "view" },
    { name: "roles.create", label: "Tambah Role", group: "roles", action: "create" },
    { name: "roles.edit", label: "Edit Role", group: "roles", action: "edit" },
    { name: "roles.delete", label: "Hapus Role", group: "roles", action: "delete" },
    { name: "roles.assign-permission", label: "Atur Permission Role", group: "roles", action: "assign-permission" },

    { name: "laporan-penjualan.view", label: "Lihat Laporan Penjualan", group: "laporan-penjualan", action: "view" },
    { name: "laporan-penjualan.print", label: "Cetak Laporan Penjualan", group: "laporan-penjualan", action: "print" },
    { name: "laporan-pembelian.view", label: "Lihat Laporan Pembelian", group: "laporan-pembelian", action: "view" },
    { name: "laporan-pembelian.print", label: "Cetak Laporan Pembelian", group: "laporan-pembelian", action: "print" },
    { name: "laporan-stok.view", label: "Lihat Laporan Stok", group: "laporan-stok", action: "view" },
    { name: "laporan-mutasi.view", label: "Lihat Laporan Mutasi", group: "laporan-mutasi", action: "view" },
    { name: "laporan-pembayaran.view", label: "Lihat Laporan Pembayaran", group: "laporan-pembayaran", action: "view" },
  ];

  const allPermissions = await prisma.permission.createMany({
    data: permissionData,
    skipDuplicates: true,
  });

  /*
  ============================
  ROLE PERMISSIONS (Superadmin dapat semua)
  ============================
  */

  const superadminRole = await prisma.role.findUnique({ where: { name: "superadmin" } });
  const allPerms = await prisma.permission.findMany();

  if (superadminRole && allPerms.length > 0) {
    await prisma.rolePermission.createMany({
      data: allPerms.map((p) => ({
        role_id: superadminRole.id,
        permission_id: p.id,
      })),
      skipDuplicates: true,
    });
  }

  /*
  ============================
  ASSIGN SUPERADMIN ROLE KE USER ADMIN
  ============================
  */

  const adminUser = await prisma.loginPemakai.findUnique({ where: { username: "admin" } });

  if (adminUser && superadminRole) {
    await prisma.userRole.createMany({
      data: [{ loginpemakai_id: adminUser.id, role_id: superadminRole.id }],
      skipDuplicates: true,
    });
  }

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
