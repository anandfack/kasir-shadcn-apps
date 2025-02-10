/*
  Warnings:

  - Added the required column `kode_supplier` to the `supplier_m` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier_m` ADD COLUMN `kode_supplier` VARCHAR(191) NOT NULL;
