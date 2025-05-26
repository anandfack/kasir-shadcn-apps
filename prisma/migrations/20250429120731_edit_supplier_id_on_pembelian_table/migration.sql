/*
  Warnings:

  - You are about to drop the column `suppplier_id` on the `pembelian_t` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pembelian_t` DROP FOREIGN KEY `pembelian_t_suppplier_id_fkey`;

-- DropIndex
DROP INDEX `pembelian_t_suppplier_id_fkey` ON `pembelian_t`;

-- AlterTable
ALTER TABLE `pembelian_t` DROP COLUMN `suppplier_id`,
    ADD COLUMN `supplier_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `pembelian_t` ADD CONSTRAINT `pembelian_t_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
