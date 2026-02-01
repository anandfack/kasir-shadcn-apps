-- AlterTable
ALTER TABLE `produkvariant_m` ADD COLUMN `satuan_produk_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `produkvariant_m` ADD CONSTRAINT `produkvariant_m_satuan_produk_id_fkey` FOREIGN KEY (`satuan_produk_id`) REFERENCES `satuanproduk_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
