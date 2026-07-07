import { requireUserId } from "@/lib/auth";
import { fetchRows } from "@/lib/queries";
import { CustomersView } from "@/components/CustomersView";

export default async function Page() {
  const userId = await requireUserId();
  const [rows, issues, meetings, opportunities, marketIntel] = await Promise.all([
    fetchRows("customers", userId),
    fetchRows("customer-issues", userId),
    fetchRows("meetings", userId),
    fetchRows("opportunities", userId),
    fetchRows("market-intelligence", userId),
  ]);

  return (
    <CustomersView
      rows={rows}
      issues={issues}
      meetings={meetings}
      opportunities={opportunities}
      marketIntel={marketIntel}
    />
  );
}
