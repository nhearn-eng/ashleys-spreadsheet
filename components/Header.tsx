"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function Header({ userLabel }: { userLabel?: string }) {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((n) => pathname.startsWith(n.href));
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-line bg-parchment/80 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="font-display text-2xl text-ink">
          {current?.label ?? "Dashboard"}
        </h1>
        <p className="text-sm text-warmgray">{today}</p>
      </div>
      {userLabel && (
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-ink">{userLabel}</p>
            <p className="text-xs text-warmgray">Signed in</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cream">
            {userLabel.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}
    </header>
  );
}
