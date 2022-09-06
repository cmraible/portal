/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_owner_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "owner_id";
