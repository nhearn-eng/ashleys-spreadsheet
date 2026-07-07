import { quoteForDay } from "@/lib/quotes";

export function GreetingBanner() {
  const quote = quoteForDay();
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-gradient-to-r from-sage-soft/70 to-parchment px-5 py-3.5">
      <span className="text-2xl leading-none" aria-hidden>
        🦀
      </span>
      <p className="font-display text-lg text-ink">
        <span className="text-sage-dark">Hey Crab,</span>{" "}
        <span className="italic text-navy">{quote}</span>
      </p>
    </div>
  );
}
