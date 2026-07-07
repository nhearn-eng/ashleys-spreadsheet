import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/utils";
import { DailyPlannerForm } from "@/components/DailyPlannerForm";

export default async function DailyPlannerPage() {
  const userId = await requireUserId();
  const plan = await prisma.dailyPlan.findUnique({
    where: { userId_date: { userId, date: startOfToday() } },
  });
  return <DailyPlannerForm plan={plan} />;
}
