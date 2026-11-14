import { useState, type FormEvent } from 'react';
import { MessageSquare, Scale, Send, ShieldCheck, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal } from '@/components/ui/reveal';
import { buttonClass } from '@/lib/button';
import { cn } from '@/lib/cn';
import { emails } from '@/lib/site';

const CHANNELS: { icon: LucideIcon; title: string; body: string; email: string }[] = [
  {
    icon: MessageSquare,
    title: 'General & support',
    body: 'Questions, feedback or a bug to report.',
    email: emails.hello,
  },
  {
    icon: ShieldCheck,
    title: 'Privacy',
    body: 'Your data, GDPR requests or deleting your account.',
    email: emails.privacy,
  },
  { icon: Scale, title: 'Legal', body: 'Questions about our terms of service.', email: emails.legal },
];

const TOPICS = ['General question', 'Bug report', 'Feature request', 'Privacy', 'Partnership'];

const field =
  'w-full rounded-xl border border-pm-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-pm-muted focus:border-pm-primary focus:ring-2 focus:ring-pm-primary/15';

/** Ways to reach us, and a short form that opens a ready-to-send email in the visitor's mail app
 * (the site has no server of its own to send it from). */
export function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const topic = String(data.get('topic'));
    const to = topic === 'Privacy' ? emails.privacy : emails.hello;
    const body = `${data.get('message')}\n\n${data.get('name')}`;
    const params = new URLSearchParams({ subject: `[Prodmate] ${topic}`, body });
    window.location.href = `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
    setSent(true);
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to the team.">
        Questions, feedback, or something not working? Write to the right inbox, or use the form.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-8 pb-24 sm:px-6 sm:pt-10 lg:grid-cols-5">
        <ul className="flex flex-col gap-4 lg:col-span-2">
          {CHANNELS.map(({ icon: Icon, title, body, email }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="rounded-3xl border border-pm-line p-6">
              <Icon aria-hidden className="size-5 text-pm-accent" />
              <p className="mt-4 text-[15px] font-medium">{title}</p>
              <p className="mt-1 text-sm text-pm-muted">{body}</p>
              <a
                href={`mailto:${email}`}
                className="mt-3 inline-block font-mono text-[13px] underline decoration-pm-line underline-offset-4 transition-colors hover:decoration-current"
              >
                {email}
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="rounded-3xl border border-pm-line p-2 lg:col-span-3">
          <form
            onSubmit={submit}
            className="flex h-full flex-col gap-4 rounded-2xl bg-pm-shell/60 p-6 sm:p-8"
          >
            <p className="text-[15px] font-medium">Send a message</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                Name
                <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Topic
                <select name="topic" defaultValue={TOPICS[0]} className={cn(field, 'cursor-pointer')}>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-1 flex-col gap-1.5 text-sm">
              Message
              <textarea
                name="message"
                required
                rows={6}
                placeholder="How can we help?"
                className={cn(field, 'min-h-36 flex-1 resize-y')}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className={buttonClass('primary', 'cursor-pointer')}>
                Open in your email app
                <Send aria-hidden />
              </button>
              <p aria-live="polite" className="text-xs text-pm-muted">
                {sent
                  ? 'Your email app should open with the message ready to send.'
                  : 'Nothing is sent until you press send there.'}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </>
  );
}
