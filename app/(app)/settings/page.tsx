import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsPanel } from "@/components/SettingsPanel";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return (
    <SettingsPanel
      lastLogin={user?.lastLogin ? user.lastLogin.toISOString() : null}
    />
  );
}
