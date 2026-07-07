import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:opacity-50 disabled:pointer-events-none";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };
  const variants = {
    primary: "bg-navy text-cream hover:bg-navy-dark",
    secondary:
      "bg-white text-ink border border-line hover:bg-cream",
    ghost: "text-warmgray hover:text-ink hover:bg-cream",
    danger: "bg-danger text-white hover:opacity-90",
  };
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

export function Label({
  className,
  children,
  htmlFor,
}: {
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-xs font-semibold uppercase tracking-wide text-warmgray mb-1.5",
        className
      )}
    >
      {children}
    </label>
  );
}

const fieldStyles =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-warmgray-light focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldStyles, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldStyles, "min-h-[80px] resize-y", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(fieldStyles, "appearance-none bg-white pr-8", className)}
      {...props}
    >
      {children}
    </select>
  );
});

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-danger">{message}</p>;
}
