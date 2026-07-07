"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "lg";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div
        className="fixed inset-0 bg-navy-dark/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 my-auto w-full rounded-[var(--radius-card)] border border-line bg-parchment shadow-2xl",
          size === "lg" ? "max-w-2xl" : "max-w-md"
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="font-display text-xl text-ink">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-warmgray">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-warmgray hover:bg-cream hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
