// A daily "Hey Crab, …" pep talk. Cute, a little silly, occasionally nautical.
// The quote is deterministic per calendar day: same all day, new one tomorrow.

export const CRAB_QUOTES = [
  "you miss 100% of the containers you don't book.",
  "walk sideways if you must, but keep moving forward.",
  "the early crab gets the cargo.",
  "smooth seas never made a skilled sailor — go make some waves.",
  "pinch today right by the claws.",
  "you're more capable than you're giving yourself credit for.",
  "one good call can change the whole week. make it.",
  "stay salty. stay hungry. stay kind.",
  "small steps sideways still get you there.",
  "be the tide, not the driftwood.",
  "today's a great day to close something.",
  "follow up like the ocean — relentless and unbothered.",
  "hard shell, soft heart, sharp pitch.",
  "the best time to email was yesterday. the second best is now.",
  "you don't have to be great to start, but start.",
  "rates rise, rates fall — you stay steady.",
  "scuttle boldly toward the hard thing first.",
  "every 'no' is just a slower 'not yet.'",
  "keep your claws sharp and your inbox at zero.",
  "big ocean, small crab, zero fear.",
  "progress over perfection — even a crab crosses the beach eventually.",
  "someone out there needs exactly what you're selling today.",
  "breathe. sip your coffee. then go get it.",
  "you've handled every hard day so far. 100% track record.",
  "make the tide come to you.",
  "confidence is a muscle. flex it before your 10:30.",
  "the cargo waits for the crab who calls.",
  "don't overthink it — pinch, pivot, proceed.",
  "quiet consistency beats loud effort. keep showing up.",
  "you're the calmest crab in the harbor. act like it.",
  "turn today's surcharge into tomorrow's opportunity.",
  "low tide is temporary. keep walking.",
] as const;

/** The quote for a given day (defaults to today), stable across the whole day. */
export function quoteForDay(date: Date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return CRAB_QUOTES[dayOfYear % CRAB_QUOTES.length];
}
