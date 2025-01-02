-- CreateTable
CREATE TABLE `barang_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodebarang` VARCHAR(191) NOT NULL,
    `namabarang` VARCHAR(191) NOT NULL,
    `satuan_id` INTEGER NULL,
    `hargabeli` INTEGER NOT NULL,
    `hargajual` INTEGER NOT NULL,
    `stok` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `isaktif` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `kategori_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategoribarang_m` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodekategori` VARCHAR(191) NOT NULL,
    `namakategori` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `barang_m` ADD CONSTRAINT `barang_m_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategoribarang_m`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
