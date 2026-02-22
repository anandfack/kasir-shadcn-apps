-- CreateTable
CREATE TABLE `DocumentCounter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `DocumentCounter_prefix_date_key`(`prefix`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
