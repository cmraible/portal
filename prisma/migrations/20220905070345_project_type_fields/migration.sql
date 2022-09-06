-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "monthly_hours" INTEGER,
ADD COLUMN     "price_id" MONEY,
ADD COLUMN     "rate" MONEY,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'In Progress',
ADD COLUMN     "type" TEXT;
