-- AlterTable
ALTER TABLE `penerimaanbarang_t` ADD COLUMN `nomor_faktur` VARCHAR(191) NULL,
    ADD COLUMN `nomor_surat_jalan` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_faktur` DATETIME(3) NULL,
    ADD COLUMN `tanggal_surat_jalan` VARCHAR(191) NULL;
