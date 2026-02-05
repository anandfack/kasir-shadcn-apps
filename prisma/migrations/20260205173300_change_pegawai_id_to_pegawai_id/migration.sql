/*
  Warnings:

  - You are about to drop the column `pegawaiId` on the `purchaseorderdetail_t` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `purchaseorderdetail_t` DROP FOREIGN KEY `purchaseorderdetail_t_pegawaiId_fkey`;

-- DropIndex
DROP INDEX `purchaseorderdetail_t_pegawaiId_fkey` ON `purchaseorderdetail_t`;

-- AlterTable
ALTER TABLE `purchaseorderdetail_t` DROP COLUMN `pegawaiId`,
    ADD COLUMN `pegawai_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `purchaseorderdetail_t` ADD CONSTRAINT `purchaseorderdetail_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
