/**
 * Site-wide configuration. Keep URLs and navigation here so sections never hardcode them.
 */

const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://chat.prodmate.dev").replace(/\/$/, "");

export const siteConfig = {
  name: "ProdMate",
  tagline: "From an idea to an execution ready software blueprint.",
  description:
    "ProdMate turns a plain English software idea into PRDs, user stories, database schemas, API designs, architecture, Docker, CI/CD and testing plans in one AI workspace.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://prodmate.dev",
  appUrl,
  contactEmail: "krishgupta0072@gmail.com",
  copyrightYear: 2026,
} as const;

export const appLinks = {
  start: `${appUrl}/`,
  integrations: `${appUrl}/integrations`,
  privacy: `${appUrl}/privacy`,
  terms: `${appUrl}/terms`,
  cookies: `${appUrl}/cookies`,
} as const;

/** In-page sections. `id` must match the section element id. */
export const mainNav = [
  { label: "Workflow", id: "workflow" },
  { label: "Blueprint", id: "blueprint" },
  { label: "Integrations", id: "integrations" },
  { label: "How it works", id: "how-it-works" },
  { label: "FAQ", id: "faq" },
] as const;

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Workflow", href: "/#workflow" },
      { label: "Blueprint", href: "/#blueprint" },
      { label: "Integrations", href: "/#integrations" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Open workspace", href: appLinks.start },
      { label: "All integrations", href: appLinks.integrations },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact the team", href: `mailto:${siteConfig.contactEmail}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
] as const;
