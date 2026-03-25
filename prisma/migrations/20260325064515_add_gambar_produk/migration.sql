-- CreateTable
CREATE TABLE `gambarproduk_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produk_id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gambarproduk_m` ADD CONSTRAINT `gambarproduk_m_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk_m`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
