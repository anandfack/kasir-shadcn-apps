/*
  Warnings:

  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `produk_m` DROP FOREIGN KEY `produk_m_supplier_id_fkey`;

-- DropIndex
DROP INDEX `produk_m_supplier_id_fkey` ON `produk_m`;

-- DropTable
DROP TABLE `supplier`;

-- CreateTable
CREATE TABLE `supplier_m` (
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

-- AddForeignKey
ALTER TABLE `produk_m` ADD CONSTRAINT `produk_m_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
