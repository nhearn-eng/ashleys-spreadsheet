-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "top1" TEXT NOT NULL DEFAULT '',
    "top2" TEXT NOT NULL DEFAULT '',
    "top3" TEXT NOT NULL DEFAULT '',
    "mustDo" TEXT NOT NULL DEFAULT '',
    "shouldDo" TEXT NOT NULL DEFAULT '',
    "wouldBeNice" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "inboxProcessed" BOOLEAN NOT NULL DEFAULT false,
    "trackerUpdated" BOOLEAN NOT NULL DEFAULT false,
    "prospectsUpdated" BOOLEAN NOT NULL DEFAULT false,
    "crmUpdated" BOOLEAN NOT NULL DEFAULT false,
    "tomorrowTop3" BOOLEAN NOT NULL DEFAULT false,
    "expensesChecked" BOOLEAN NOT NULL DEFAULT false,
    "scorecard" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerIssue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOpened" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "customer" TEXT NOT NULL,
    "contact" TEXT NOT NULL DEFAULT '',
    "issue" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "waitingOn" TEXT NOT NULL DEFAULT '',
    "nextAction" TEXT NOT NULL DEFAULT '',
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Open',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "industry" TEXT NOT NULL DEFAULT '',
    "contact" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "lastContact" TIMESTAMP(3),
    "nextFollowUp" TIMESTAMP(3),
    "lastTouchpoint" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Researching',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "mainContact" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "tradeLane" TEXT NOT NULL DEFAULT '',
    "annualVolume" TEXT NOT NULL DEFAULT '',
    "lastMeeting" TIMESTAMP(3),
    "nextMeeting" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketIntelligence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateAnnounced" TIMESTAMP(3),
    "trade" TEXT NOT NULL DEFAULT '',
    "surchargeType" TEXT NOT NULL DEFAULT 'GRI',
    "amount" TEXT NOT NULL DEFAULT '',
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "customersImpacted" TEXT NOT NULL DEFAULT '',
    "actionRequired" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Need Review',
    "namedAccountImpact" TEXT NOT NULL DEFAULT '',
    "talkingPoints" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "trade" TEXT NOT NULL DEFAULT '',
    "opportunity" TEXT NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT '',
    "action" TEXT NOT NULL DEFAULT '',
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Open',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "customer" TEXT NOT NULL,
    "contact" TEXT NOT NULL DEFAULT '',
    "meetingType" TEXT NOT NULL DEFAULT 'Call',
    "discussion" TEXT NOT NULL DEFAULT '',
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDueDate" TIMESTAMP(3),
    "crmUpdated" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPriority" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Customer',
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketTheme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "blankSailings" TEXT NOT NULL DEFAULT '',
    "capacity" TEXT NOT NULL DEFAULT '',
    "spotRateDirection" TEXT NOT NULL DEFAULT '',
    "equipmentSituation" TEXT NOT NULL DEFAULT '',
    "keyCustomerRisks" TEXT NOT NULL DEFAULT '',
    "talkingPoints" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportExportLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "dateRange" TEXT NOT NULL DEFAULT '',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyPlan_userId_idx" ON "DailyPlan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPlan_userId_date_key" ON "DailyPlan"("userId", "date");

-- CreateIndex
CREATE INDEX "CustomerIssue_userId_idx" ON "CustomerIssue"("userId");

-- CreateIndex
CREATE INDEX "Prospect_userId_idx" ON "Prospect"("userId");

-- CreateIndex
CREATE INDEX "Customer_userId_idx" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "MarketIntelligence_userId_idx" ON "MarketIntelligence"("userId");

-- CreateIndex
CREATE INDEX "Opportunity_userId_idx" ON "Opportunity"("userId");

-- CreateIndex
CREATE INDEX "MeetingLog_userId_idx" ON "MeetingLog"("userId");

-- CreateIndex
CREATE INDEX "WeeklyPriority_userId_idx" ON "WeeklyPriority"("userId");

-- CreateIndex
CREATE INDEX "MarketTheme_userId_idx" ON "MarketTheme"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketTheme_userId_month_key" ON "MarketTheme"("userId", "month");

-- CreateIndex
CREATE INDEX "ReportExportLog_userId_idx" ON "ReportExportLog"("userId");

