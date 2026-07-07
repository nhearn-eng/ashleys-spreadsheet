import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-white shadow-[0_1px_2px_rgba(28,27,25,0.04),0_8px_24px_-16px_rgba(28,27,25,0.15)]",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {title && (
              <h2 className="font-display text-lg text-ink">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-warmgray">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn("px-5 py-4", bodyClassName)}>{children}</div>
    </section>
  );
}
