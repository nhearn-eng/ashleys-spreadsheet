"use client";

import * as React from "react";

const QUIPS = [
  "Psst… logged your meetings today? 🦀",
  "Just crabbing by. You've got this.",
  "Follow-ups won't chase themselves! click click",
  "Looking sharp today, boss.",
  "Sideways is still forward. Keep going.",
  "Don't forget your expense report!",
  "The tide's with you today.",
  "Need a pinch of motivation? I'm right here.",
  "Scuttle scuttle… nice work.",
  "Any GRIs to notify customers about?",
  "Inbox at zero yet? No rush. Mostly.",
  "You're the calmest crab in the harbor.",
];

const SPEED = 0.19; // px per ms

function prefEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const p = JSON.parse(localStorage.getItem("scc-prefs") || "{}");
    return p.crab !== false; // default on
  } catch {
    return true;
  }
}

function CrabSvg() {
  return (
    <svg width="76" height="60" viewBox="0 0 76 60" fill="none" aria-hidden>
      {/* legs — left side */}
      <g stroke="#b23b23" strokeWidth="3" strokeLinecap="round">
        <path className="crab-leg" d="M24 40 L12 44" />
        <path className="crab-leg crab-leg-2" d="M24 44 L11 50" />
        <path className="crab-leg crab-leg-3" d="M25 47 L14 55" />
        {/* legs — right side */}
        <path className="crab-leg" d="M52 40 L64 44" />
        <path className="crab-leg crab-leg-2" d="M52 44 L65 50" />
        <path className="crab-leg crab-leg-3" d="M51 47 L62 55" />
      </g>

      {/* claws */}
      <g>
        <g className="crab-claw-l">
          <path d="M22 38 L10 30" stroke="#c8442a" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M10 30 q-7 -5 -3 -11 q4 4 8 3 q-3 4 3 8 q-5 2 -8 0Z"
            fill="#e05435"
          />
        </g>
        <g className="crab-claw-r">
          <path d="M54 38 L66 30" stroke="#c8442a" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M66 30 q7 -5 3 -11 q-4 4 -8 3 q3 4 -3 8 q5 2 8 0Z"
            fill="#e05435"
          />
        </g>
      </g>

      {/* body */}
      <ellipse cx="38" cy="42" rx="20" ry="14" fill="#e0552f" />
      <ellipse cx="38" cy="39" rx="20" ry="12" fill="#ec6a44" />
      {/* cheeks */}
      <circle cx="28" cy="43" r="2.4" fill="#f3937a" opacity="0.8" />
      <circle cx="48" cy="43" r="2.4" fill="#f3937a" opacity="0.8" />

      {/* eye stalks + eyes */}
      <g className="crab-eye">
        <rect x="31.5" y="24" width="3" height="10" rx="1.5" fill="#c8442a" />
        <circle cx="33" cy="23" r="5" fill="#fff" />
        <circle cx="33.8" cy="23.4" r="2.2" fill="#2c2b27" />
        <circle cx="34.6" cy="22.4" r="0.8" fill="#fff" />
      </g>
      <g className="crab-eye" style={{ animationDelay: "0.2s" }}>
        <rect x="41.5" y="24" width="3" height="10" rx="1.5" fill="#c8442a" />
        <circle cx="43" cy="23" r="5" fill="#fff" />
        <circle cx="43.8" cy="23.4" r="2.2" fill="#2c2b27" />
        <circle cx="44.6" cy="22.4" r="0.8" fill="#fff" />
      </g>

      {/* smile */}
      <path d="M32 45 q6 5 12 0" stroke="#a5311c" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CrabMascot() {
  const crabRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<HTMLDivElement>(null);
  const enabledRef = React.useRef(true);
  const timers = React.useRef<number[]>([]);
  const [bubble, setBubble] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const randomQuip = () => QUIPS[Math.floor(Math.random() * QUIPS.length)];

    function walk() {
      const el = crabRef.current;
      const svg = svgRef.current;
      if (!el || !svg || !enabledRef.current) return;

      const w = window.innerWidth;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speak = Math.random() < 0.55;
      const start = dir > 0 ? -140 : w + 140;
      const end = dir > 0 ? w + 140 : -140;
      const mid = w / 2 - 38;

      svg.style.transform = `scaleX(${dir})`;
      el.style.transition = "none";
      el.style.transform = `translateX(${start}px)`;
      void el.offsetWidth; // reflow so the starting point paints

      if (reduced || !speak) {
        const dur = Math.abs(end - start) / SPEED;
        el.style.transition = `transform ${dur}ms linear`;
        el.style.transform = `translateX(${end}px)`;
        later(scheduleNext, dur + 300);
        return;
      }

      const dur1 = Math.abs(mid - start) / SPEED;
      el.style.transition = `transform ${dur1}ms linear`;
      el.style.transform = `translateX(${mid}px)`;
      later(() => {
        setBubble(randomQuip());
        later(() => {
          setBubble(null);
          const dur2 = Math.abs(end - mid) / SPEED;
          el.style.transition = `transform ${dur2}ms linear`;
          el.style.transform = `translateX(${end}px)`;
          later(scheduleNext, dur2 + 300);
        }, 3400);
      }, dur1 + 60);
    }

    function scheduleNext() {
      if (!enabledRef.current) return;
      later(walk, 34000 + Math.random() * 46000); // 34–80s between visits
    }

    function refreshEnabled() {
      enabledRef.current = prefEnabled();
      setVisible(enabledRef.current);
      if (enabledRef.current) {
        clearAll();
        later(walk, 4000);
      } else {
        clearAll();
        setBubble(null);
      }
    }

    refreshEnabled();
    window.addEventListener("scc-crab-changed", refreshEnabled);
    return () => {
      clearAll();
      window.removeEventListener("scc-crab-changed", refreshEnabled);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-3 left-0 z-40 h-24 w-full overflow-hidden"
      aria-hidden
    >
      <div
        ref={crabRef}
        className="absolute bottom-0"
        style={{ transform: "translateX(-140px)", willChange: "transform" }}
      >
        {bubble && (
          <div className="crab-bubble pointer-events-none absolute -top-2 left-1/2 w-max max-w-[220px] -translate-x-1/2 -translate-y-full">
            <div className="rounded-2xl border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-lg">
              {bubble}
            </div>
            <div className="mx-auto -mt-1 h-3 w-3 rotate-45 border-b border-r border-line bg-white" />
          </div>
        )}
        <div
          ref={svgRef}
          className="crab-bob pointer-events-auto cursor-pointer"
          onClick={() => {
            setBubble(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
            window.setTimeout(() => setBubble(null), 3000);
          }}
          title="Hi 🦀"
        >
          <CrabSvg />
        </div>
      </div>
    </div>
  );
}
