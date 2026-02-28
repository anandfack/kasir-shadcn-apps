/*
  Warnings:

  - You are about to drop the column `penerimaan_id` on the `invoicepembelian_t` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoicepembelian_t` DROP FOREIGN KEY `invoicepembelian_t_penerimaan_id_fkey`;

-- DropIndex
DROP INDEX `invoicepembelian_t_penerimaan_id_fkey` ON `invoicepembelian_t`;

-- AlterTable
ALTER TABLE `invoicepembelian_t` DROP COLUMN `penerimaan_id`;
