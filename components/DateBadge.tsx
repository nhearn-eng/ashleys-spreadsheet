import { cn } from "@/lib/utils";
import { formatDate, isOverdue, isToday } from "@/lib/utils";

export function DateBadge({
  value,
  highlight = true,
}: {
  value?: Date | string | null;
  highlight?: boolean;
}) {
  if (!value) return <span className="text-warmgray-light">—</span>;
  const overdue = highlight && isOverdue(value);
  const today = highlight && isToday(value);
  return (
    <span
      className={cn(
        "whitespace-nowrap text-sm",
        overdue && "font-semibold text-danger",
        today && "font-semibold text-gold",
        !overdue && !today && "text-ink"
      )}
    >
      {formatDate(value)}
      {overdue && " ⚠"}
    </span>
  );
}
