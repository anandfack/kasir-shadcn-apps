-- AlterTable
ALTER TABLE `penerimaanbarangdetail_t` ADD COLUMN `qty_retur` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `returpenerimaan_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_retur` VARCHAR(191) NOT NULL,
    `penerimaanbarang_id` INTEGER NOT NULL,
    `tanggal_retur` DATETIME(3) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `alasan_retur` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `returpenerimaan_t_nomor_retur_key`(`nomor_retur`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailreturpenerimaan_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `returpenerimaan_id` INTEGER NOT NULL,
    `penerimaanbarangdetail_id` INTEGER NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `jumlah_produk` INTEGER NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `keterangan_retur` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `returpenerimaan_t` ADD CONSTRAINT `returpenerimaan_t_penerimaanbarang_id_fkey` FOREIGN KEY (`penerimaanbarang_id`) REFERENCES `penerimaanbarang_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailreturpenerimaan_t` ADD CONSTRAINT `detailreturpenerimaan_t_returpenerimaan_id_fkey` FOREIGN KEY (`returpenerimaan_id`) REFERENCES `returpenerimaan_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailreturpenerimaan_t` ADD CONSTRAINT `detailreturpenerimaan_t_penerimaanbarangdetail_id_fkey` FOREIGN KEY (`penerimaanbarangdetail_id`) REFERENCES `penerimaanbarangdetail_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
