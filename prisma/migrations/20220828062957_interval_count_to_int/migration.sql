/*
  Warnings:

  - The `interval_count` column on the `Price` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "interval_count",
ADD COLUMN     "interval_count" INTEGER;
