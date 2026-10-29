import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Audiences } from "@/components/sections/audiences";
import { BlueprintExplorer } from "@/components/sections/blueprint-explorer";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { IntegrationHub } from "@/components/sections/integration-hub";
import { Tagline } from "@/components/sections/tagline";
import { ToolStrip } from "@/components/sections/tool-strip";
import { Workflow } from "@/components/sections/workflow";

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ToolStrip />
        <Workflow />
        <BlueprintExplorer />
        <Tagline />
        <IntegrationHub />
        <HowItWorks />
        <Audiences />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
