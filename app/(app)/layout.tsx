import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const label = user?.name || user?.email || undefined;
  return <AppShell userLabel={label}>{children}</AppShell>;
}
