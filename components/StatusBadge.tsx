import { cn } from "@/lib/utils";

type Tone = "info" | "warn" | "danger" | "ok" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  info: "bg-navy/10 text-navy",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  ok: "bg-ok-soft text-ok",
  muted: "bg-line/50 text-warmgray",
};

function toneForStatus(status: string): Tone {
  const s = status.toLowerCase();
  if (["escalated", "lost", "expired"].some((k) => s.includes(k))) return "danger";
  if (
    ["closed", "won", "completed", "active customer", "customer notified"].some(
      (k) => s.includes(k)
    )
  )
    return "ok";
  if (
    ["waiting", "monitoring", "need review", "notification needed", "proposal"].some(
      (k) => s.includes(k)
    )
  )
    return "warn";
  if (["open", "in progress", "contacted", "meeting", "researching", "outreach", "follow up"].some((k) => s.includes(k)))
    return "info";
  return "muted";
}

export function StatusBadge({ status }: { status: string }) {
  if (!status) return <span className="text-warmgray-light">—</span>;
  const tone = toneForStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone]
      )}
    >
      {status}
    </span>
  );
}
