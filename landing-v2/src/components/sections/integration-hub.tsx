import type { IconType } from "react-icons";
import { SiGithub, SiGmail, SiGooglecalendar, SiJira, SiMarkdown, SiNotion } from "react-icons/si";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { appLinks } from "@/config/site";

const destinations: { name: string; gets: string; icon: IconType; color: string }[] = [
  { name: "GitHub", gets: "Repo with README.md and docs/", icon: SiGithub, color: "#ffffff" },
  { name: "Notion", gets: "One page per file", icon: SiNotion, color: "#ffffff" },
  { name: "Jira", gets: "Stories and roadmap as issues", icon: SiJira, color: "#2684ff" },
  { name: "Gmail", gets: "Summary email to your team", icon: SiGmail, color: "#ea4335" },
  {
    name: "Calendar",
    gets: "Milestones and review meetings",
    icon: SiGooglecalendar,
    color: "#4285f4",
  },
  { name: "Markdown", gets: "Copy any file as plain text", icon: SiMarkdown, color: "#ffffff" },
];

const VB_W = 1000;
const VB_H = 340;
const HUB = { x: 420, y: VB_H / 2 };
const END_X = 680;
const ys = destinations.map((_, i) => 30 + (i * (VB_H - 60)) / (destinations.length - 1));
const colors = ["#8b6cf0", "#6f8cf2", "#3b8eea", "#2fb3a0", "#5fc16a", "#f2b07c"];

/** Compact dark panel: one hub, six destinations. No painting, so it scrolls past quickly. */
export function IntegrationHub() {
  return (
    <section id="integrations" className="py-12 md:py-16">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-night bg-[radial-gradient(80%_60%_at_30%_0%,#2a2119_0%,transparent_70%),radial-gradient(#ffffff0d_1px,transparent_1px)] bg-[size:auto,18px_18px] px-6 py-14 md:px-12 md:py-16">
          <SectionHeading
            tone="light"
            eyebrow="Integrations"
            title={["One blueprint.", "Every tool it belongs in."]}
            description="Export once and each tool gets the format it expects. No copy and paste, no reformatting."
          />

          {/* Desktop diagram */}
          <Reveal className="relative mx-auto mt-10 hidden aspect-[1000/340] max-w-4xl md:block">
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              <defs>
                {destinations.map((_, i) => (
                  <linearGradient key={i} id={`line-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor={colors[i]} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={colors[i]} stopOpacity="0.8" />
                  </linearGradient>
                ))}
              </defs>
              {ys.map((y, i) => {
                const d = `M ${HUB.x} ${HUB.y} C ${HUB.x + 130} ${HUB.y}, ${END_X - 130} ${y}, ${END_X} ${y}`;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={`url(#line-${i})`} strokeWidth="1.5" />
                    <path
                      d={d}
                      fill="none"
                      stroke={colors[i]}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="flow-line"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                    <circle cx={END_X} cy={y} r="4" fill="#2fa65a" />
                    <circle cx={END_X} cy={y} r="9" fill="#2fa65a" opacity="0.2" />
                  </g>
                );
              })}
              <circle cx={HUB.x} cy={HUB.y} r="5" fill="#f2b07c" />
            </svg>

            {/* Hub label */}
            <div
              className="absolute flex -translate-x-full -translate-y-1/2 flex-col items-end pr-6"
              style={{ left: `${(HUB.x / VB_W) * 100}%`, top: "50%" }}
            >
              <span className="flex items-center gap-3 text-3xl font-medium tracking-tight text-white lg:text-4xl">
                <LogoMark className="size-9" tone="light" />
                <span>
                  Prod<span className="text-fade">Mate</span>
                </span>
              </span>
              <span className="mt-3 h-1 w-full rounded-full bg-[linear-gradient(90deg,#2fa65a,#f2b07c,#e0793a,#8b6cf0,#3b8eea)]" />
            </div>

            {/* Destinations */}
            {destinations.map((dest, i) => {
              const Icon = dest.icon;
              return (
                <div
                  key={dest.name}
                  className="absolute flex -translate-y-1/2 items-center gap-3 pl-5"
                  style={{ left: `${(END_X / VB_W) * 100}%`, top: `${(ys[i] / VB_H) * 100}%` }}
                >
                  <Icon
                    className="size-5 shrink-0"
                    style={{ color: dest.color }}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">{dest.name}</span>
                    <span className="block text-xs text-white/45">{dest.gets}</span>
                  </span>
                </div>
              );
            })}
          </Reveal>

          {/* Mobile list */}
          <ul className="mt-10 grid gap-2 sm:grid-cols-2 md:hidden">
            {destinations.map((dest) => {
              const Icon = dest.icon;
              return (
                <Reveal
                  as="li"
                  key={dest.name}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10"
                >
                  <Icon
                    className="size-5 shrink-0"
                    style={{ color: dest.color }}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">{dest.name}</span>
                    <span className="block text-xs text-white/50">{dest.gets}</span>
                  </span>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-10 flex justify-center">
            <ButtonLink href={appLinks.integrations} variant="white" size="sm">
              View all integrations
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
