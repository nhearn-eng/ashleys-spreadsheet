"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Download, Upload, Trash2, LogOut } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { Button, Input, Label, FieldError } from "./ui";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  changePassword,
  exportAllData,
  importData,
  deleteAllData,
} from "@/lib/actions";
import { formatDate } from "@/lib/utils";

type Prefs = { dark: boolean; compact: boolean };

function readPrefs(): Prefs {
  if (typeof window === "undefined") return { dark: false, compact: false };
  try {
    return { dark: false, compact: false, ...JSON.parse(localStorage.getItem("scc-prefs") || "{}") };
  } catch {
    return { dark: false, compact: false };
  }
}

export function SettingsPanel({ lastLogin }: { lastLogin: string | null }) {
  const router = useRouter();
  const [prefs, setPrefs] = React.useState<Prefs>({ dark: false, compact: false });
  // Load persisted prefs after mount (deterministic SSR output avoids a mismatch).
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(readPrefs());
  }, []);

  function togglePref(key: keyof Prefs) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem("scc-prefs", JSON.stringify(next));
      document.documentElement.classList.toggle(key, next[key]);
      return next;
    });
  }

  // --- password ---
  const [pw, setPw] = React.useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErr, setPwErr] = React.useState<Record<string, string>>({});
  const [pwMsg, setPwMsg] = React.useState("");
  const [pwBusy, setPwBusy] = React.useState(false);

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwBusy(true);
    setPwErr({});
    setPwMsg("");
    const res = await changePassword(pw);
    setPwBusy(false);
    if (res.ok) {
      setPwMsg("Password updated.");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const flat: Record<string, string> = {};
      for (const [k, v] of Object.entries(res.errors)) if (v?.[0]) flat[k] = v[0];
      setPwErr(flat);
    }
  }

  // --- data ---
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function doExport() {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      const res = await importData(parsed);
      if (res.ok) router.refresh();
      else alert(res.message ?? "Import failed.");
    } catch {
      alert("That file isn't valid JSON.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Change Password" description="Update your login password.">
        <form onSubmit={submitPassword} className="max-w-md space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={pw.currentPassword}
              onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
            />
            <FieldError message={pwErr.currentPassword} />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={pw.newPassword}
              onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <FieldError message={pwErr.newPassword} />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={pw.confirmPassword}
              onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
            />
            <FieldError message={pwErr.confirmPassword} />
          </div>
          {pwMsg && <p className="text-sm text-ok">{pwMsg}</p>}
          <Button type="submit" disabled={pwBusy}>
            {pwBusy ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </SectionCard>

      <SectionCard title="Appearance" description="Tune the interface to your taste.">
        <div className="space-y-2">
          <ToggleRow
            label="Dark mode"
            description="Switch to a low-light theme."
            checked={prefs.dark}
            onChange={() => togglePref("dark")}
          />
          <ToggleRow
            label="Compact tables"
            description="Tighter row spacing for dense data."
            checked={prefs.compact}
            onChange={() => togglePref("compact")}
          />
        </div>
      </SectionCard>

      <SectionCard title="Data" description="Back up, restore, or clear your data.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={doExport}>
            <Download className="h-4 w-4" /> Export all data (JSON)
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={doImport}
          />
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" /> Delete all data
          </Button>
        </div>
        <p className="mt-3 text-xs text-warmgray">
          Importing replaces all current records with the backup&apos;s contents.
        </p>
      </SectionCard>

      <SectionCard title="Security" description="Session details.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink">Last login</p>
            <p className="text-sm text-warmgray">
              {lastLogin ? formatDate(lastLogin) : "—"}
            </p>
          </div>
          <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete all data?"
        message="This permanently removes every record you've entered. Your login stays intact. This cannot be undone."
        confirmLabel="Delete everything"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteAllData();
          setConfirmDelete(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-warmgray">{description}</p>
      </div>
      <input type="checkbox" className="h-5 w-5 accent-navy" checked={checked} onChange={onChange} />
    </label>
  );
}
