/*
  Warnings:

  - You are about to drop the column `locked` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the `Merchant` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "locked";

-- DropTable
DROP TABLE "Merchant";

-- DropEnum
DROP TYPE "AuthType";
