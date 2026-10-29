import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Painting } from "@/components/ui/painting";
import { Reveal } from "@/components/ui/reveal";
import { ChatWorkspace } from "@/components/workspace/chat-workspace";
import { appLinks } from "@/config/site";

export function Hero() {
  return (
    <section id="top" className="p-2 sm:p-3">
      {/* White mat around the painting, so the backdrop reads as a framed picture */}
      <div className="rounded-[32px] bg-white p-2 shadow-card sm:rounded-[42px] sm:p-3">
        <div className="relative isolate overflow-hidden rounded-[24px] bg-paper-2 sm:rounded-[32px]">
          {/* Albert Bierstadt, Lake Lucerne (1858), public domain */}
          <Painting name="lucerne" position="center 30%" priority />
          {/* Paper wash at the top keeps ink text legible over the bright sky */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[62%] bg-[linear-gradient(180deg,#f6f3eef2_0%,#f6f3eeb3_45%,#f6f3ee00_100%)]"
          />

          <Container className="pt-36 pb-12 sm:pt-44 md:pb-16">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <Reveal>
                <a
                  href="#blueprint"
                  className="group inline-flex items-center gap-2 rounded-full glass py-1 pr-3 pl-1 text-sm text-ink-2 transition-colors duration-300 hover:bg-white"
                >
                  <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
                    Beta
                  </span>
                  14 files from one prompt
                  <span
                    aria-hidden="true"
                    className="text-muted transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-8 text-5xl leading-[1.02] font-medium tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  Turn one idea into
                  <br />
                  <span className="text-fade">a complete blueprint</span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mx-auto mt-6 max-w-[620px] text-lg text-ink-2">
                  Describe your product once. ProdMate writes the docs, config, schema, API design,
                  Docker setup, user stories, roadmap and test plan, then ships them to GitHub,
                  Notion and Jira.
                </p>
              </Reveal>

              <Reveal delay={0.24} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <ButtonLink href={appLinks.start}>Start planning free</ButtonLink>
                <ButtonLink href="#workflow" variant="glass" arrow={false}>
                  See how it works
                </ButtonLink>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-5 text-sm text-ink-2">Free during beta · No credit card</p>
              </Reveal>
            </div>

            <Reveal delay={0.36} className="mx-auto mt-16 max-w-[1080px] md:mt-24">
              <div className="rounded-[26px] bg-white/30 p-2 ring-1 ring-white/50 backdrop-blur-md">
                <ChatWorkspace />
              </div>
            </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
}
