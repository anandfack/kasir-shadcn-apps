/*
  Warnings:

  - Added the required column `purchase_order_detail_id` to the `penerimaanbarangdetail_t` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `penerimaanbarangdetail_t` ADD COLUMN `purchase_order_detail_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `penerimaanbarangdetail_t` ADD CONSTRAINT `penerimaanbarangdetail_t_purchase_order_detail_id_fkey` FOREIGN KEY (`purchase_order_detail_id`) REFERENCES `purchaseorderdetail_t`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
