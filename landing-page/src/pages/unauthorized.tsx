import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button-link';
import { links } from '@/lib/site';

/** 401: the visitor needs to sign in. The site itself has no accounts, so this sends them to the
 * chat app's login (links.login). Served at /401 and /unauthorized; hosts can point 401s here. */
export function UnauthorizedPage() {
  return (
    <div className="pb-32">
      <PageHeader eyebrow="401" title="You need to sign in to see this.">
        Your projects and settings live in your ProdMate account. Log in to pick up where you left off.
      </PageHeader>
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-3 px-4 sm:px-6">
        <ButtonLink href={links.login} variant="primary">
          <LogIn aria-hidden />
          Log in
        </ButtonLink>
        <ButtonLink href="/">
          <ArrowLeft aria-hidden />
          Back to home
        </ButtonLink>
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <p className="flex items-center gap-2 text-sm text-pm-muted">
          <LockKeyhole aria-hidden className="size-4" />
          New to ProdMate? Signing up is free during the beta.
        </p>
      </div>
    </div>
  );
}
