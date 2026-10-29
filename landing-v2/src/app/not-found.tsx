import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Painting } from "@/components/ui/painting";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      {/* Albert Bierstadt, Lake Lucerne (1858), public domain */}
      <Painting name="lucerne" position="center 30%" priority />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-2/3 bg-[linear-gradient(180deg,#f6f3eef2,#f6f3ee00)]"
      />
      <span className="rounded-full glass px-4 py-2 text-ink">
        <Logo />
      </span>
      <p className="font-mono text-sm font-semibold text-ember-600">404</p>
      <h1 className="text-5xl font-medium tracking-tight text-ink">
        This page is not <span className="text-fade">in the blueprint</span>
      </h1>
      <p className="max-w-md text-lg text-ink-2">
        The link may be old or mistyped. Head back to the homepage to keep exploring.
      </p>
      <ButtonLink href="/">Back to homepage</ButtonLink>
    </main>
  );
}
