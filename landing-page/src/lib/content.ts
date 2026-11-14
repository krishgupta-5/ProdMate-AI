import { links } from '@/lib/site';

/** The one plan: everything is free while Prodmate is in beta. */
export const FREE_PLAN = {
  name: 'Free',
  price: '₹0',
  term: 'for everyone during the beta',
  blurb: 'Every feature, no card needed, while we test and improve Prodmate.',
  perks: [
    'Unlimited projects',
    'PRDs, user stories and roadmaps',
    'API design and database schema',
    'Architecture, folder structure and CI/CD',
    'AI project assistant',
    'GitHub, Jira and Notion export',
    'Gmail and Google Calendar',
    'Share links and Markdown downloads',
  ],
};
export const FAQ = [
  {
    q: 'What does Prodmate write for me?',
    a: 'From one description it writes nine documents: product requirements, tech stack, database schema, API design, folder structure, Docker Compose, a CI/CD pipeline, a testing plan, and one combined blueprint.',
  },
  {
    q: 'Can I change one part without starting over?',
    a: 'Yes. Each document has its own pipeline, so you can regenerate only the database schema and keep the rest. You can also ask the assistant for a change, like adding a column, and it explains how that affects your API.',
  },
  {
    q: 'Which tools does it connect to?',
    a: 'GitHub, Notion, Jira, Gmail and Google Calendar. You connect each one with its normal sign-in, and nothing is sent until you choose to export.',
  },
  {
    q: 'What ends up in my GitHub repository?',
    a: 'A new repository with the folder structure from your plan, a Dockerfile, docker-compose.yml, a GitHub Actions workflow, and the full blueprint as the README.',
  },
  {
    q: 'How do I share a plan with someone who has no account?',
    a: 'Download it as a Markdown file, publish it to a shared Notion page, or send a share link.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Prodmate is in beta, and there is one plan: free, with every feature and every integration included. A daily usage allowance keeps the service fair for everyone while we test.',
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    items: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Features', href: '/#features' },
      { label: 'Integrations', href: '/#integrations' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Docs', href: links.docs },
      { label: 'Get started', href: links.getStarted },
      { label: 'Contact', href: links.contact },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy', href: links.privacy },
      { label: 'Terms', href: links.terms },
      { label: 'Cookies', href: links.cookies },
    ],
  },
];
