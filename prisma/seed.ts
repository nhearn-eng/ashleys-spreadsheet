import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { buildSeed } from "../lib/seedData";

const prisma = new PrismaClient();

const SINGLE_USER_ID = "single-user";

async function main() {
  const username = (process.env.AUTH_USERNAME ?? "ashley").toLowerCase();
  const password = process.env.AUTH_PASSWORD ?? "command2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { id: SINGLE_USER_ID },
    create: { id: SINGLE_USER_ID, email: username, passwordHash },
    update: { email: username, passwordHash },
  });
  console.log(`✔ User ready — username "${username}"`);

  const userId = SINGLE_USER_ID;

  // Clear existing business data for a clean, repeatable seed.
  await prisma.$transaction([
    prisma.customerIssue.deleteMany({ where: { userId } }),
    prisma.prospect.deleteMany({ where: { userId } }),
    prisma.customer.deleteMany({ where: { userId } }),
    prisma.marketIntelligence.deleteMany({ where: { userId } }),
    prisma.opportunity.deleteMany({ where: { userId } }),
    prisma.meetingLog.deleteMany({ where: { userId } }),
    prisma.weeklyPriority.deleteMany({ where: { userId } }),
    prisma.dailyPlan.deleteMany({ where: { userId } }),
    prisma.marketTheme.deleteMany({ where: { userId } }),
  ]);

  const data = buildSeed();
  const withUser = <T,>(rows: T[]) => rows.map((r) => ({ ...r, userId }));

  await prisma.customer.createMany({ data: withUser(data.customers) });
  await prisma.customerIssue.createMany({ data: withUser(data.customerIssues) });
  await prisma.prospect.createMany({ data: withUser(data.prospects) });
  await prisma.marketIntelligence.createMany({ data: withUser(data.marketIntelligence) });
  await prisma.opportunity.createMany({ data: withUser(data.opportunities) });
  await prisma.meetingLog.createMany({ data: withUser(data.meetings) });
  await prisma.weeklyPriority.createMany({ data: withUser(data.weeklyPriorities) });
  await prisma.dailyPlan.create({ data: { ...data.dailyPlan, userId } });
  await prisma.marketTheme.create({ data: { ...data.marketTheme, userId } });

  console.log("✔ Seed data inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
