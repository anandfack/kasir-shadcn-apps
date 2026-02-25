/*
  Warnings:

  - You are about to drop the `InvoicePembelian` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `InvoicePembelian` DROP FOREIGN KEY `InvoicePembelian_penerimaan_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoicepenerimaan_t` DROP FOREIGN KEY `invoicepenerimaan_t_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaraninvoice_t` DROP FOREIGN KEY `pembayaraninvoice_t_invoice_id_fkey`;

-- DropIndex
DROP INDEX `pembayaraninvoice_t_invoice_id_fkey` ON `pembayaraninvoice_t`;

-- DropTable
DROP TABLE `InvoicePembelian`;

-- CreateTable
CREATE TABLE `invoicepembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penerimaan_id` INTEGER NOT NULL,
    `nomor_invoice` VARCHAR(191) NOT NULL,
    `tanggal_invoice` DATETIME(3) NOT NULL,
    `total_tagihan` DOUBLE NOT NULL,
    `sisa_tagihan` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoicepembelian_t_nomor_invoice_key`(`nomor_invoice`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invoicepembelian_t` ADD CONSTRAINT `invoicepembelian_t_penerimaan_id_fkey` FOREIGN KEY (`penerimaan_id`) REFERENCES `penerimaanbarang_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoicepenerimaan_t` ADD CONSTRAINT `invoicepenerimaan_t_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoicepembelian_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaraninvoice_t` ADD CONSTRAINT `pembayaraninvoice_t_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoicepembelian_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
