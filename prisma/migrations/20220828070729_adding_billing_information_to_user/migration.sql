-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billing_city" TEXT,
ADD COLUMN     "billing_country" TEXT,
ADD COLUMN     "billing_line_1" TEXT,
ADD COLUMN     "billing_line_2" TEXT,
ADD COLUMN     "billing_postal_code" TEXT,
ADD COLUMN     "billing_state" TEXT,
ADD COLUMN     "payment_method_id" TEXT;
