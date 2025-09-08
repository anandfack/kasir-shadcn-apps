-- CreateTable
CREATE TABLE `emailverification_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `loginpemakai_id` INTEGER NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emailverification_t` ADD CONSTRAINT `emailverification_t_loginpemakai_id_fkey` FOREIGN KEY (`loginpemakai_id`) REFERENCES `loginpemakai_k`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
