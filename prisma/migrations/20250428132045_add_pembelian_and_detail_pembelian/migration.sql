-- CreateTable
CREATE TABLE `pembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_pembelian` VARCHAR(191) NOT NULL,
    `tanggal_pembelian` DATETIME(3) NOT NULL,
    `status_pembelian` VARCHAR(191) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `suppplier_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailpembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pembelian_id` INTEGER NULL,
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
ALTER TABLE `pembelian_t` ADD CONSTRAINT `pembelian_t_suppplier_id_fkey` FOREIGN KEY (`suppplier_id`) REFERENCES `supplier_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpembelian_t` ADD CONSTRAINT `detailpembelian_t_pembelian_id_fkey` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian_t`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailpembelian_t` ADD CONSTRAINT `detailpembelian_t_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
