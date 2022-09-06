-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_staff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_superuser" BOOLEAN NOT NULL DEFAULT false;
