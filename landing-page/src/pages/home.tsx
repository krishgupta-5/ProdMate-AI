import { DemoVideo } from '@/components/landing/demo-video';
import { Faq } from '@/components/landing/faq';
import { Features } from '@/components/landing/features';
import { FinalCta } from '@/components/landing/final-cta';
import { Hero } from '@/components/landing/hero';
import { Integrations } from '@/components/landing/integrations';
import { Pricing } from '@/components/landing/pricing';

export function HomePage() {
  return (
    <>
      <Hero />
      <DemoVideo />
      <Features />
      <Integrations />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
