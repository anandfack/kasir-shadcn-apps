/*
  Warnings:

  - You are about to drop the `DocumentCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `DocumentCounter`;

-- CreateTable
CREATE TABLE `documentcounter_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `documentcounter_t_prefix_date_key`(`prefix`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
