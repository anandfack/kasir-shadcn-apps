/*
  Warnings:

  - You are about to drop the column `tanggal_kadaluarsa` on the `stokproduk_m` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_masuk` on the `stokproduk_m` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `stokproduk_m` DROP COLUMN `tanggal_kadaluarsa`,
    DROP COLUMN `tanggal_masuk`;

-- CreateTable
CREATE TABLE `mutasistok_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_id` INTEGER NULL,
    `tipe_mutasi` VARCHAR(191) NOT NULL,
    `jumlah_mutasi` INTEGER NOT NULL,
    `keterangan_mutasi` VARCHAR(191) NOT NULL,
    `pegawai_id` INTEGER NULL,
    `satuan_produk_id` INTEGER NULL,
    `tanggal_kadaluarsa` DATETIME(3) NULL,
    `tanggal_mutasi` DATETIME(3) NOT NULL,
    `nomor_mutasi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mutasistok_m` ADD CONSTRAINT `mutasistok_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasistok_m` ADD CONSTRAINT `mutasistok_m_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasistok_m` ADD CONSTRAINT `mutasistok_m_satuan_produk_id_fkey` FOREIGN KEY (`satuan_produk_id`) REFERENCES `satuanproduk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
