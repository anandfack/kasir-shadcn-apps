-- AlterTable
ALTER TABLE `mutasistok_m` ADD COLUMN `produkVariantId` INTEGER NULL;

-- CreateTable
CREATE TABLE `produkvariant_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_id` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `ukuran` VARCHAR(191) NOT NULL,
    `warna` VARCHAR(191) NULL,
    `is_aktif` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `produkvariant_m_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stokvariant_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_variant_id` INTEGER NOT NULL,
    `jumlah_stok` INTEGER NOT NULL,
    `minimal_stok` INTEGER NOT NULL,
    `maksimal_stok` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stokvariant_m_produk_variant_id_key`(`produk_variant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mutasistok_m` ADD CONSTRAINT `mutasistok_m_produkVariantId_fkey` FOREIGN KEY (`produkVariantId`) REFERENCES `produkvariant_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produkvariant_m` ADD CONSTRAINT `produkvariant_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stokvariant_m` ADD CONSTRAINT `stokvariant_m_produk_variant_id_fkey` FOREIGN KEY (`produk_variant_id`) REFERENCES `produkvariant_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
