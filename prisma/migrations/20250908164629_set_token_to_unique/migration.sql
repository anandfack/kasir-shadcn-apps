/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `emailverification_t` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `emailverification_t_token_key` ON `emailverification_t`(`token`);
