/*
  Warnings:

  - You are about to drop the column `pegawaiId` on the `penerimaanbarangdetail_t` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `penerimaanbarangdetail_t` DROP FOREIGN KEY `penerimaanbarangdetail_t_pegawaiId_fkey`;

-- DropIndex
DROP INDEX `penerimaanbarangdetail_t_pegawaiId_fkey` ON `penerimaanbarangdetail_t`;

-- AlterTable
ALTER TABLE `penerimaanbarangdetail_t` DROP COLUMN `pegawaiId`,
    ADD COLUMN `pegawai_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `penerimaanbarangdetail_t` ADD CONSTRAINT `penerimaanbarangdetail_t_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
