import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CrabMascot } from "./CrabMascot";

export function AppShell({
  userLabel,
  children,
}: {
  userLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header userLabel={userLabel} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <CrabMascot />
    </div>
  );
}
