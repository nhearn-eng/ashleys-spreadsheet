-- CreateTable
CREATE TABLE "RateSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeLane" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "tradeLane" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Rates',
    "sentiment" TEXT NOT NULL DEFAULT 'Steady',
    "sourceUrl" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateSnapshot_userId_idx" ON "RateSnapshot"("userId");

-- CreateIndex
CREATE INDEX "MarketInsight_userId_idx" ON "MarketInsight"("userId");
