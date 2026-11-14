import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { AssistantDemo } from '@/components/demos/assistant-demo';
import { GenerateDemo } from '@/components/demos/generate-demo';
import { RegenerateDemo } from '@/components/demos/regenerate-demo';
import { ShareDemo } from '@/components/demos/share-demo';
import { Wallpaper } from '@/components/landing/wallpaper';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteLink } from '@/components/ui/site-link';
import { cn } from '@/lib/cn';
import { links } from '@/lib/site';
import type { Scene } from '@/lib/scenes';

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Features" title="Every document your project needs.">
        Written together, kept in one place, and easy to change as the idea grows.
      </SectionHeading>
      <div className="mt-10 flex flex-col gap-4">
        <FeatureRow scene="aurora" title="One prompt, nine documents." demo={<GenerateDemo />}>
          Product requirements, tech stack, database schema, API design, folder structure, Docker, CI/CD, a
          testing plan and one blueprint that ties them together.
        </FeatureRow>
        <FeatureRow scene="haze" flip title="Change it by asking." demo={<AssistantDemo />}>
          The assistant knows your whole plan. Ask for a new column or a different database and it updates the
          schema and tells you what else it touches.
        </FeatureRow>
        <FeatureRow
          scene="tide"
          title="Rewrite one part, keep the rest."
          demo={<RegenerateDemo />}
          href={`${links.docs}#architecture-security`}
          more="about regenerating documents"
        >
          Each document has its own pipeline, so regenerating the schema doesn't touch your requirements or
          your API.
        </FeatureRow>
        <FeatureRow scene="bloom" flip title="Share it with one link." demo={<ShareDemo />}>
          Anyone with the link can read the full plan, no account needed, and fork it into their own
          workspace.
        </FeatureRow>
      </div>
    </section>
  );
}

/** A feature as a wide row: the claim on one side, its live demo in a white window on a painted
 * wallpaper on the other. `flip` puts the demo first. `more` finishes "Learn more" for screen
 * readers, e.g. "about the assistant". */
function FeatureRow({
  title,
  scene,
  demo,
  children,
  href,
  more,
  flip,
}: {
  title: string;
  scene: Scene;
  demo: ReactNode;
  children: ReactNode;
  href?: string;
  more?: string;
  flip?: boolean;
}) {
  return (
    <Reveal className="grid overflow-hidden rounded-3xl border border-pm-line p-2 md:grid-cols-5">
      <div className={cn('flex flex-col justify-end p-5 sm:p-8 md:col-span-2', flip && 'md:order-last')}>
        <p className="max-w-sm text-[17px] leading-[1.4] font-medium text-pretty sm:text-lg">
          {title} <span className="text-pm-muted">{children}</span>
        </p>
        {href && (
          <SiteLink
            href={href}
            className="group mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-pm-accent outline-none focus-visible:underline"
          >
            Learn more<span className="sr-only"> {more}</span>
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </SiteLink>
        )}
      </div>
      <Wallpaper
        scene={scene}
        className="flex min-h-[360px] items-center justify-center p-3 sm:min-h-[420px] sm:p-10 md:col-span-3"
      >
        <div className="flex w-full max-w-md justify-center rounded-xl bg-white p-4 sm:p-6">{demo}</div>
      </Wallpaper>
    </Reveal>
  );
}
