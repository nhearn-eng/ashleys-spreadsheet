import { requireUserId } from "@/lib/auth";
import { fetchRows } from "@/lib/queries";
import { ResourceView } from "@/components/ResourceView";
import { MarketThemesPanel } from "@/components/MarketThemesPanel";
import { prisma } from "@/lib/prisma";
import { currentMonthKey } from "@/lib/utils";

export default async function Page() {
  const userId = await requireUserId();
  const rows = await fetchRows("market-intelligence", userId);
  const month = currentMonthKey();
  const theme = await prisma.marketTheme.findUnique({
    where: { userId_month: { userId, month } },
  });

  return (
    <div className="space-y-6">
      <MarketThemesPanel month={month} theme={theme} />
      <ResourceView resourceKey="market-intelligence" rows={rows} />
    </div>
  );
}
