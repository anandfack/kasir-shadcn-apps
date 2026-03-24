/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `kategoriproduk_m` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `produk_m` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kategoriproduk_m` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `produk_m` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kategoriproduk_m_slug_key` ON `kategoriproduk_m`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `produk_m_slug_key` ON `produk_m`(`slug`);
