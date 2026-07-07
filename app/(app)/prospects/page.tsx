import { requireUserId } from "@/lib/auth";
import { fetchRows } from "@/lib/queries";
import { ResourceView } from "@/components/ResourceView";

export default async function Page() {
  const userId = await requireUserId();
  const rows = await fetchRows("prospects", userId);
  return <ResourceView resourceKey="prospects" rows={rows} />;
}
