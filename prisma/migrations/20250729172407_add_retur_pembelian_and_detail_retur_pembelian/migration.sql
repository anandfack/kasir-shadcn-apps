-- CreateTable
CREATE TABLE `returpembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_retur` VARCHAR(191) NOT NULL,
    `pembelian_id` INTEGER NULL,
    `tanggal_retur` DATETIME(3) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `keterangan_retur` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailreturpembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `retur_pembelian_id` INTEGER NULL,
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

-- AddForeignKey
ALTER TABLE `returpembelian_t` ADD CONSTRAINT `returpembelian_t_pembelian_id_fkey` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian_t`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailreturpembelian_t` ADD CONSTRAINT `detailreturpembelian_t_retur_pembelian_id_fkey` FOREIGN KEY (`retur_pembelian_id`) REFERENCES `returpembelian_t`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailreturpembelian_t` ADD CONSTRAINT `detailreturpembelian_t_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
