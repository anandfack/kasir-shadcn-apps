/*
  Warnings:

  - A unique constraint covering the columns `[produk_id]` on the table `hargaproduk_m` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `hargaproduk_m_produk_id_key` ON `hargaproduk_m`(`produk_id`);
