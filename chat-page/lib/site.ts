// The marketing site (landing-page): pricing, docs and the legal pages live there.
// Override with NEXT_PUBLIC_LANDING_URL; defaults to the live site.
export const LANDING_URL = (
  process.env.NEXT_PUBLIC_LANDING_URL ||
  "https://prodmate.dev"
).replace(/\/$/, "");
