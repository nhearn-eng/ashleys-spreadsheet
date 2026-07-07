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
  "Wheee — don't mind me.",
  "Where to next? Everywhere!",
];

// The crab gets… insecure. Jealous-boyfriend energy, aimed at the app's own data.
const PARANOID_QUIPS = [
  "who you on the phone to? 👀",
  "and what exactly are you wearing right now?",
  "who's 'Marcus' in your meeting log?? explain.",
  "you were on the Prospects tab. who is she.",
  "why'd it take you 3 seconds to click that?",
  "you added a new customer… without telling me?",
  "why are you 'Waiting on Customer' and not waiting on ME 😔",
  "define 'active customer'. define it.",
  "who are you meeting 'In Person'?? i'm right here.",
  "you've been on Reporting Portal a while. reporting to WHO.",
  "i saw you hover over Log Out. going somewhere?",
  "who gave you that GRI announcement. was it a man.",
  "why do you need 'follow-ups' with other people 😤",
  "you closed the tab yesterday. where were you.",
  "'meeting scheduled'?? scheduled with WHOM.",
  "why is your inbox at zero. who'd you reply to.",
];

const SPEED = 0.17; // px per ms
const PARANOID_MIN = 480_000; // 8 min
const PARANOID_MAX = 600_000; // 10 min

function prefEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const p = JSON.parse(localStorage.getItem("scc-prefs") || "{}");
    return p.crab !== false; // default on
  } catch {
    return true;
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function CrabSvg() {
  return (
    <svg width="76" height="60" viewBox="0 0 76 60" fill="none" aria-hidden>
      <g stroke="#b23b23" strokeWidth="3" strokeLinecap="round">
        <path className="crab-leg" d="M24 40 L12 44" />
        <path className="crab-leg crab-leg-2" d="M24 44 L11 50" />
        <path className="crab-leg crab-leg-3" d="M25 47 L14 55" />
        <path className="crab-leg" d="M52 40 L64 44" />
        <path className="crab-leg crab-leg-2" d="M52 44 L65 50" />
        <path className="crab-leg crab-leg-3" d="M51 47 L62 55" />
      </g>
      <g>
        <g className="crab-claw-l">
          <path d="M22 38 L10 30" stroke="#c8442a" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 30 q-7 -5 -3 -11 q4 4 8 3 q-3 4 3 8 q-5 2 -8 0Z" fill="#e05435" />
        </g>
        <g className="crab-claw-r">
          <path d="M54 38 L66 30" stroke="#c8442a" strokeWidth="4" strokeLinecap="round" />
          <path d="M66 30 q7 -5 3 -11 q-4 4 -8 3 q3 4 -3 8 q5 2 8 0Z" fill="#e05435" />
        </g>
      </g>
      <ellipse cx="38" cy="42" rx="20" ry="14" fill="#e0552f" />
      <ellipse cx="38" cy="39" rx="20" ry="12" fill="#ec6a44" />
      <circle cx="28" cy="43" r="2.4" fill="#f3937a" opacity="0.8" />
      <circle cx="48" cy="43" r="2.4" fill="#f3937a" opacity="0.8" />
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
      <path d="M32 45 q6 5 12 0" stroke="#a5311c" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CrabMascot() {
  const crabRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<HTMLDivElement>(null);
  const posRef = React.useRef({ x: 200, y: 300 });
  const enabledRef = React.useRef(true);
  const timers = React.useRef<number[]>([]);
  const [bubble, setBubble] = React.useState<string | null>(null);
  const [bubbleBelow, setBubbleBelow] = React.useState(false);
  const [sus, setSus] = React.useState(false);
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
    const randomParanoid = () =>
      PARANOID_QUIPS[Math.floor(Math.random() * PARANOID_QUIPS.length)];

    const paranoidPending = { current: false };
    let lastDir = 1;

    // Roam: pick a nearby-ish random point, walk there, pause, sometimes speak, repeat forever.
    function roam() {
      const el = crabRef.current;
      const svg = svgRef.current;
      if (!el || !svg || !enabledRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const { x, y } = posRef.current;

      // wander by a random offset (occasionally a bigger jaunt)
      const reach = Math.random() < 0.25 ? 620 : 340;
      const tx = clamp(x + (Math.random() * 2 - 1) * reach, 12, w - 88);
      const ty = clamp(y + (Math.random() * 2 - 1) * (reach * 0.7), 60, h - 84);

      const dir = tx < x - 4 ? -1 : tx > x + 4 ? 1 : lastDir;
      lastDir = dir;
      svg.style.transform = `scaleX(${dir})`;

      const dist = Math.hypot(tx - x, ty - y);
      const dur = reduced ? 0 : Math.max(700, dist / SPEED);

      el.style.transition = reduced ? "none" : `transform ${dur}ms ease-in-out`;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      posRef.current = { x: tx, y: ty };

      later(() => {
        const pause = 250 + Math.random() * 1400;
        if (paranoidPending.current) {
          // He stops and interrogates you. Holds the bubble longer.
          paranoidPending.current = false;
          setBubbleBelow(ty < 150);
          setSus(true);
          setBubble(randomParanoid());
          later(() => {
            setBubble(null);
            setSus(false);
          }, 6000);
          later(roam, 6300);
        } else if (Math.random() < 0.28) {
          setBubbleBelow(ty < 150);
          setBubble(randomQuip());
          later(() => setBubble(null), 3200);
          later(roam, 3400);
        } else {
          later(roam, pause);
        }
      }, dur + 30);
    }

    function scheduleParanoid() {
      later(() => {
        paranoidPending.current = true;
        scheduleParanoid();
      }, PARANOID_MIN + Math.random() * (PARANOID_MAX - PARANOID_MIN));
    }

    function start() {
      const el = crabRef.current;
      if (!el) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      posRef.current = { x: w * 0.5, y: h * 0.62 };
      el.style.transition = "none";
      el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      void el.offsetWidth;
      later(roam, 900);
      scheduleParanoid();
    }

    function refreshEnabled() {
      enabledRef.current = prefEnabled();
      setVisible(enabledRef.current);
      clearAll();
      if (enabledRef.current) start();
      else setBubble(null);
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
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <div
        ref={crabRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ transform: "translate(-200px, -200px)", willChange: "transform" }}
      >
        {bubble && (
          <div
            className={`crab-bubble pointer-events-none absolute left-1/2 w-max max-w-[220px] -translate-x-1/2 ${
              bubbleBelow ? "top-full mt-2" : "-top-2 -translate-y-full"
            }`}
          >
            {bubbleBelow && (
              <div className="mx-auto -mb-1 h-3 w-3 rotate-45 border-l border-t border-line bg-white" />
            )}
            <div
              className={`rounded-2xl bg-white px-3.5 py-2 text-sm text-ink shadow-lg ${
                sus ? "border-2 border-danger/50 font-medium" : "border border-line"
              }`}
            >
              {bubble}
            </div>
            {!bubbleBelow && (
              <div className="mx-auto -mt-1 h-3 w-3 rotate-45 border-b border-r border-line bg-white" />
            )}
          </div>
        )}
        <div
          ref={svgRef}
          className="crab-bob pointer-events-auto cursor-pointer"
          onClick={() => {
            setBubbleBelow(posRef.current.y < 150);
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
