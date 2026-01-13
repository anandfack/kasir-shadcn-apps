-- AlterTable
ALTER TABLE `pembayaran_t` MODIFY `tanggal_bayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `pembayaranpembelian_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pembelian_id` INTEGER NOT NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL,
    `jumlah_bayar` DOUBLE NOT NULL,
    `metode_bayar` VARCHAR(191) NOT NULL,
    `nomor_referensi` VARCHAR(191) NULL,
    `nomor_rekening` VARCHAR(191) NULL,
    `pegawai_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pembayaranpembelian_t` ADD CONSTRAINT `pembayaranpembelian_t_pembelian_id_fkey` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaranpembelian_t` ADD CONSTRAINT `pembayaranpembelian_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
