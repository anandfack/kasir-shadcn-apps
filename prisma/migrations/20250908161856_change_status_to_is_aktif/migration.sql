/*
  Warnings:

  - You are about to drop the column `status` on the `loginpemakai_k` table. All the data in the column will be lost.
  - Added the required column `is_aktif` to the `loginpemakai_k` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loginpemakai_k` DROP COLUMN `status`,
    ADD COLUMN `is_aktif` BOOLEAN NOT NULL;
