import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button-link';

export function NotFoundPage() {
  return (
    <div className="pb-32">
      <PageHeader eyebrow="404" title="This page doesn’t exist.">
        The link may be old, or the address mistyped.
      </PageHeader>
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <ButtonLink href="/" variant="primary">
          <ArrowLeft aria-hidden />
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
