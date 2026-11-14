import { emails } from '@/lib/site';

/** The legal pages' text, moved here from chat-page/app/{privacy,terms,cookies}. A section's body is
 * paragraphs; a `list` item is `[label, text]`. */
export type LegalSection = {
  id: string;
  title: string;
  body: string[];
  list?: [string, string][];
  note?: string;
  email?: string;
};

export type LegalDoc = {
  slug: string;
  title: string;
  short: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = 'June 27, 2026';

export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  short: 'Privacy',
  updated: UPDATED,
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: [
        'ProdMate (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our developer platform and AI services.',
      ],
    },
    {
      id: 'information',
      title: 'Information we collect',
      body: [
        'We collect information through two primary channels to ensure optimal performance and security of our workspace environment:',
      ],
      list: [
        [
          'Account & identity',
          'Email, name, and necessary registration details to establish your workspace and prevent unauthorized access.',
        ],
        [
          'Telemetry & quotas',
          'Interactions with AI assistants strictly to manage compute resources, token quotas, and system reliability.',
        ],
        [
          'Project artifacts',
          'The architecture, code, and specifications generated within your private sessions.',
        ],
      ],
    },
    {
      id: 'security',
      title: 'Data security & storage',
      body: [
        'Your data is protected by industry-standard technical measures. We utilize end-to-end encryption for sensitive data in transit, secure server architectures, and routine access audits.',
      ],
      note: 'Model training: your project data, code snippets, and proprietary architectures are completely isolated. They are never used to train our generalized AI models without your explicit, opt-in consent.',
    },
    {
      id: 'contact',
      title: 'Contact information',
      body: [
        'If you have questions regarding your data, GDPR compliance, or wish to exercise your “Right to be Forgotten,” our privacy engineering team is available directly at:',
      ],
      email: emails.privacy,
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Service',
  short: 'Terms',
  updated: UPDATED,
  sections: [
    {
      id: 'acceptance',
      title: 'Acceptance of terms',
      body: [
        'By accessing and using ProdMate (“the Service”), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
      ],
    },
    {
      id: 'description',
      title: 'Description of service',
      body: [
        'ProdMate is a developer platform that provides AI-powered coding assistance, project management tools, and collaborative workspace features. The service is free while it is in beta.',
      ],
    },
    {
      id: 'accounts',
      title: 'User accounts and responsibilities',
      body: [
        'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You are solely responsible for all activities that occur under your account.',
      ],
    },
    {
      id: 'payment',
      title: 'Pricing during the beta',
      body: [
        'Prodmate is currently in beta and free to use. There is one plan, and it includes every feature and integration at no cost. We do not ask for payment details.',
        'A daily usage allowance keeps the service fair for everyone. If we introduce paid plans in the future, we will tell you at least 30 days before any charge applies, and you can choose whether to continue.',
      ],
    },
    {
      id: 'ip',
      title: 'Intellectual property rights',
      body: [
        'You retain ownership of all intellectual property rights in the code and content you create using our service. We retain ownership of all rights to the ProdMate platform, software, and proprietary technology.',
      ],
    },
    {
      id: 'prohibited',
      title: 'Prohibited uses',
      body: [
        'You may not use our service for any illegal or unauthorized purpose. You may not use our service to develop malicious software, violate intellectual property rights, or engage in activities that harm others or our platform.',
      ],
    },
    {
      id: 'availability',
      title: 'Service availability and support',
      body: [
        'We strive to maintain high service availability but do not guarantee uninterrupted access. During the beta, support is provided by email on a best-effort basis.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: [
        'To the maximum extent permitted by law, ProdMate shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.',
      ],
    },
    {
      id: 'termination',
      title: 'Termination',
      body: [
        'We may terminate or suspend your account at any time for violation of these terms. You may stop using the service and delete your account at any time through your account settings.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes to terms',
      body: [
        'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any modified terms.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact information',
      body: ['If you have any questions about these Terms of Service, please contact us at:'],
      email: emails.legal,
    },
  ],
};

export const COOKIES: LegalDoc = {
  slug: 'cookies',
  title: 'Cookie Policy',
  short: 'Cookies',
  updated: UPDATED,
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: [
        'This Cookie Policy explains how ProdMate (“we,” “our,” or “us”) uses cookies and similar tracking technologies when you access our developer platform and AI workspace. By using our service, you consent to the use of cookies as described in this policy.',
      ],
    },
    {
      id: 'usage',
      title: 'How we use cookies',
      body: [
        'We use cookies to maintain secure user authentication, remember your workspace preferences, ensure session continuity, and monitor system performance. Cookies allow us to deliver a fast, reliable, and personalized AI development environment without compromising security.',
      ],
    },
    {
      id: 'types',
      title: 'Types of cookies we use',
      body: ['Our platform relies on three distinct categories of cookies:'],
      list: [
        [
          'Essential cookies',
          'Required for authentication and core security. These tokens keep you signed in securely via Clerk and protect your workspace against unauthorized requests.',
        ],
        [
          'Preference cookies',
          'Used to remember your customized settings, UI layouts, theme selections, and active project preferences across sessions.',
        ],
        [
          'Performance & telemetry cookies',
          'Help us measure API latency, token quota consumption, and resource utilization to maintain system reliability and prevent downtime.',
        ],
      ],
    },
    {
      id: 'managing',
      title: 'Managing your cookies',
      body: [
        'Most web browsers allow you to control or disable cookies through their settings preferences. However, please note that disabling essential authentication cookies will prevent you from logging into your ProdMate workspace or accessing AI services.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact information',
      body: [
        'If you have any questions or concerns about our use of cookies or tracking technologies, please reach out to our privacy engineering team at:',
      ],
      email: emails.privacy,
    },
  ],
};

export const LEGAL_DOCS = [TERMS, PRIVACY, COOKIES];
