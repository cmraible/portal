/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - Added the required column `updated` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "updatedAt",
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'New';
