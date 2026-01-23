-- AlterTable
ALTER TABLE `produkvariant_m` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `stokvariant_m` ADD COLUMN `deleted_at` DATETIME(3) NULL;
