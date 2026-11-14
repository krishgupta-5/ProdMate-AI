import { TourDemo } from '@/components/landing/tour-demo';
import { Wallpaper } from '@/components/landing/wallpaper';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

/** How it works: one project, followed in an always-playing tour from the prompt to its GitHub
 * repo, Jira board and Notion pages. */
export function DemoVideo() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-28">
      <SectionHeading eyebrow="How it works" title="One idea in, a whole plan out.">
        Follow one project from the first prompt to GitHub, Jira and Notion.
      </SectionHeading>
      <Reveal className="mt-10">
        <Wallpaper scene="dusk" className="px-3 py-8 sm:px-10 sm:py-12 md:px-16 md:py-14">
          <div className="mx-auto max-w-4xl">
            <TourDemo />
          </div>
        </Wallpaper>
      </Reveal>
    </section>
  );
}
