export const CORE_POSITIONS = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Event Head",
] as const;

export type CorePosition = (typeof CORE_POSITIONS)[number];

// Prototype-only: DSW policy states real per-account credentials are issued
// by the DSW office. Every demo account shares this password until then.
export const DEMO_PASSWORD = "iilm@123";
