/*
  Warnings:

  - You are about to drop the `barang_m` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoribarang_m` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `barang_m` DROP FOREIGN KEY `barang_m_kategori_id_fkey`;

-- DropTable
DROP TABLE `barang_m`;

-- DropTable
DROP TABLE `kategoribarang_m`;

-- CreateTable
CREATE TABLE `pegawai_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip_pegawai` VARCHAR(191) NOT NULL,
    `nama_pegawai` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,
    `alamat_pegawai` VARCHAR(191) NOT NULL,
    `nomor_telepon_pegawai` VARCHAR(191) NOT NULL,
    `email_pegawai` VARCHAR(191) NOT NULL,
    `jabatan_pegawai` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `is_aktif` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `satuanproduk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_satuan` VARCHAR(191) NOT NULL,
    `nama_satuan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stokproduk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_id` INTEGER NULL,
    `jumlah_stok` INTEGER NOT NULL,
    `minimal_stok` INTEGER NOT NULL,
    `maksimal_stok` INTEGER NOT NULL,
    `tanggal_masuk` DATETIME(3) NOT NULL,
    `tanggal_kadaluarsa` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategoriproduk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_kategori` VARCHAR(191) NOT NULL,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_supplier` VARCHAR(191) NOT NULL,
    `alamat_supplier` VARCHAR(191) NOT NULL,
    `nomor_telepon_supplier` VARCHAR(191) NOT NULL,
    `is_aktif` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hargaproduk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_id` INTEGER NULL,
    `harga_beli` DOUBLE NOT NULL,
    `harga_jual` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori_id` INTEGER NULL,
    `satuan_produk_id` INTEGER NULL,
    `supplier_id` INTEGER NULL,
    `kode_produk` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `gambar_produk` VARCHAR(191) NOT NULL,
    `is_aktif` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjualan_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_penjualan` VARCHAR(191) NOT NULL,
    `tanggal_penjualan` DATETIME(3) NOT NULL,
    `status_penjualan` VARCHAR(191) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailpenjualan_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penjualan_id` INTEGER NULL,
    `produk_id` INTEGER NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `jumlah_produk` INTEGER NOT NULL,
    `harga_produk` DOUBLE NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penjualan_id` INTEGER NOT NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL,
    `jumlah_bayar` DOUBLE NOT NULL,
    `metode_bayar` VARCHAR(191) NOT NULL,
    `nomor_referensi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stokproduk_m` ADD CONSTRAINT `stokproduk_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hargaproduk_m` ADD CONSTRAINT `hargaproduk_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk_m` ADD CONSTRAINT `produk_m_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriproduk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk_m` ADD CONSTRAINT `produk_m_satuan_produk_id_fkey` FOREIGN KEY (`satuan_produk_id`) REFERENCES `satuanproduk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk_m` ADD CONSTRAINT `produk_m_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpenjualan_t` ADD CONSTRAINT `detailpenjualan_t_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan_t`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpenjualan_t` ADD CONSTRAINT `detailpenjualan_t_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran_t` ADD CONSTRAINT `pembayaran_t_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
