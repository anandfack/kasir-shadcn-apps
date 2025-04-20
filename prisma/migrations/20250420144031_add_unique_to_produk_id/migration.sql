/*
  Warnings:

  - A unique constraint covering the columns `[produk_id]` on the table `stokproduk_m` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `stokproduk_m_produk_id_key` ON `stokproduk_m`(`produk_id`);
