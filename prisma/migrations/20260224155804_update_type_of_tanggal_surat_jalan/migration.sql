/*
  Warnings:

  - You are about to alter the column `tanggal_surat_jalan` on the `penerimaanbarang_t` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `penerimaanbarang_t` MODIFY `tanggal_surat_jalan` DATETIME(3) NULL;
