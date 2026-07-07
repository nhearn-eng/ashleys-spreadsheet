"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor } from "lucide-react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-navy text-cream">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream/10 text-cream">
          <Anchor className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-base">{APP_NAME}</p>
          <p className="text-[11px] uppercase tracking-widest text-cream/50">
            Ocean Freight Sales
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-cream/15 text-cream"
                  : "text-cream/70 hover:bg-cream/10 hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
