-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "interval_count" DROP NOT NULL,
ALTER COLUMN "trial_period_days" DROP NOT NULL;
