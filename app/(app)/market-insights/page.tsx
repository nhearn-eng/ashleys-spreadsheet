import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchRows } from "@/lib/queries";
import { getRateIndices } from "@/lib/reportUtils";
import { RateIndexPanel } from "@/components/RateIndexPanel";
import { InsightsFeed } from "@/components/InsightsFeed";

export default async function MarketInsightsPage() {
  const userId = await requireUserId();
  const [indices, snapshots, insights] = await Promise.all([
    getRateIndices(userId),
    prisma.rateSnapshot.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 8,
    }),
    fetchRows("market-insights", userId),
  ]);

  return (
    <div className="space-y-6">
      <RateIndexPanel indices={indices} snapshots={snapshots} />
      <InsightsFeed insights={insights} />
    </div>
  );
}
