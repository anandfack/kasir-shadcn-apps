/*
  Warnings:

  - You are about to drop the column `produkVariantId` on the `mutasistok_m` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `mutasistok_m` DROP FOREIGN KEY `mutasistok_m_produkVariantId_fkey`;

-- DropIndex
DROP INDEX `mutasistok_m_produkVariantId_fkey` ON `mutasistok_m`;

-- AlterTable
ALTER TABLE `mutasistok_m` DROP COLUMN `produkVariantId`;
