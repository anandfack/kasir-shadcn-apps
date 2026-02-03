-- CreateTable
CREATE TABLE `purchaseorder_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_po` VARCHAR(191) NOT NULL,
    `supplier_id` INTEGER NOT NULL,
    `pegawai_id` INTEGER NOT NULL,
    `tanggal_po` DATETIME(3) NOT NULL,
    `status_po` VARCHAR(191) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `purchaseorder_t_nomor_po_key`(`nomor_po`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchaseorderdetail_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_order_id` INTEGER NOT NULL,
    `produk_variant_id` INTEGER NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `jumlah_produk` INTEGER NOT NULL,
    `qty_diterima` INTEGER NOT NULL DEFAULT 0,
    `total_harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `pegawaiId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penerimaanbarang_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_order_id` INTEGER NOT NULL,
    `pegawai_id` INTEGER NOT NULL,
    `nomor_penerimaan` VARCHAR(191) NOT NULL,
    `tanggal_penerimaan` DATETIME(3) NOT NULL,
    `status_penerimaan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `penerimaanbarang_t_nomor_penerimaan_key`(`nomor_penerimaan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penerimaanbarangdetail_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penerimaan_barang_id` INTEGER NOT NULL,
    `produk_variant_id` INTEGER NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `jumlah_produk` INTEGER NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `pegawaiId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchaseorder_t` ADD CONSTRAINT `purchaseorder_t_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseorder_t` ADD CONSTRAINT `purchaseorder_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseorderdetail_t` ADD CONSTRAINT `purchaseorderdetail_t_purchase_order_id_fkey` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchaseorder_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseorderdetail_t` ADD CONSTRAINT `purchaseorderdetail_t_produk_variant_id_fkey` FOREIGN KEY (`produk_variant_id`) REFERENCES `produkvariant_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseorderdetail_t` ADD CONSTRAINT `purchaseorderdetail_t_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerimaanbarang_t` ADD CONSTRAINT `penerimaanbarang_t_purchase_order_id_fkey` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchaseorder_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerimaanbarang_t` ADD CONSTRAINT `penerimaanbarang_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerimaanbarangdetail_t` ADD CONSTRAINT `penerimaanbarangdetail_t_penerimaan_barang_id_fkey` FOREIGN KEY (`penerimaan_barang_id`) REFERENCES `penerimaanbarang_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerimaanbarangdetail_t` ADD CONSTRAINT `penerimaanbarangdetail_t_produk_variant_id_fkey` FOREIGN KEY (`produk_variant_id`) REFERENCES `produkvariant_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerimaanbarangdetail_t` ADD CONSTRAINT `penerimaanbarangdetail_t_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
