-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "unit_amount" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "interval_count" TEXT NOT NULL,
    "trial_period_days" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "price_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "cancel_at" TIMESTAMP(3) NOT NULL,
    "canceled_at" TIMESTAMP(3) NOT NULL,
    "trial_start" TIMESTAMP(3) NOT NULL,
    "trial_end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
