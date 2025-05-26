/*
  Warnings:

  - Added the required column `nomor_faktur` to the `pembelian_t` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pembelian_t` ADD COLUMN `nomor_faktur` VARCHAR(191) NOT NULL;
