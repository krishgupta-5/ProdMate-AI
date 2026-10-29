import type { IconType } from "react-icons";
import {
  SiDocker,
  SiGithub,
  SiGithubactions,
  SiGmail,
  SiGooglecalendar,
  SiGooglegemini,
  SiJira,
  SiMarkdown,
  SiMermaid,
  SiNotion,
} from "react-icons/si";

import { Container } from "@/components/ui/container";

const tools: { name: string; icon: IconType }[] = [
  { name: "GitHub", icon: SiGithub },
  { name: "Notion", icon: SiNotion },
  { name: "Jira", icon: SiJira },
  { name: "Gmail", icon: SiGmail },
  { name: "Google Calendar", icon: SiGooglecalendar },
  { name: "Markdown", icon: SiMarkdown },
  { name: "Mermaid", icon: SiMermaid },
  { name: "Docker", icon: SiDocker },
  { name: "GitHub Actions", icon: SiGithubactions },
  { name: "Gemini", icon: SiGooglegemini },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-16 pr-16">
      {tools.map(({ name, icon: Icon }) => (
        <li key={name} className="flex items-center gap-3 text-ghost">
          <Icon className="size-6" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight whitespace-nowrap">{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function ToolStrip() {
  return (
    <section aria-labelledby="tools-heading" className="py-16 md:py-20">
      <Container>
        <h2 id="tools-heading" className="text-center text-sm font-medium text-muted">
          Your blueprint lands in the tools your team already uses
        </h2>
      </Container>
      <div className="mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
