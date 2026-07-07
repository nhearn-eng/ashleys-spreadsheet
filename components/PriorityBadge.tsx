import { cn } from "@/lib/utils";

const CLASSES: Record<string, string> = {
  High: "bg-danger-soft text-danger",
  Medium: "bg-warn-soft text-warn",
  Low: "bg-sage-soft text-sage-dark",
};

export function PriorityBadge({ priority }: { priority: string }) {
  if (!priority) return <span className="text-warmgray-light">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        CLASSES[priority] ?? "bg-line/50 text-warmgray"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          priority === "High"
            ? "bg-danger"
            : priority === "Medium"
            ? "bg-warn"
            : "bg-sage"
        )}
      />
      {priority}
    </span>
  );
}
