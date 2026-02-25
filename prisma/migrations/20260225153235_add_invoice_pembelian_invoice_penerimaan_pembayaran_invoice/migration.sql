-- CreateTable
CREATE TABLE `InvoicePembelian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penerimaan_id` INTEGER NOT NULL,
    `nomor_invoice` VARCHAR(191) NOT NULL,
    `tanggal_invoice` DATETIME(3) NOT NULL,
    `total_tagihan` DOUBLE NOT NULL,
    `sisa_tagihan` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InvoicePembelian_nomor_invoice_key`(`nomor_invoice`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoicepenerimaan_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `penerimaan_id` INTEGER NOT NULL,

    UNIQUE INDEX `invoicepenerimaan_t_invoice_id_penerimaan_id_key`(`invoice_id`, `penerimaan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaraninvoice_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `nomor_pembayaran` VARCHAR(191) NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL,
    `jumlah_bayar` DOUBLE NOT NULL,
    `metode_bayar` VARCHAR(191) NOT NULL,
    `nomor_referensi` VARCHAR(191) NULL,
    `pegawai_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoicePembelian` ADD CONSTRAINT `InvoicePembelian_penerimaan_id_fkey` FOREIGN KEY (`penerimaan_id`) REFERENCES `penerimaanbarang_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoicepenerimaan_t` ADD CONSTRAINT `invoicepenerimaan_t_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `InvoicePembelian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoicepenerimaan_t` ADD CONSTRAINT `invoicepenerimaan_t_penerimaan_id_fkey` FOREIGN KEY (`penerimaan_id`) REFERENCES `penerimaanbarang_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaraninvoice_t` ADD CONSTRAINT `pembayaraninvoice_t_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `InvoicePembelian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaraninvoice_t` ADD CONSTRAINT `pembayaraninvoice_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
