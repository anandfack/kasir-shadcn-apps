-- AlterTable
ALTER TABLE `invoicepembelian_t` ADD COLUMN `pegawai_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `invoicepembelian_t` ADD CONSTRAINT `invoicepembelian_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
