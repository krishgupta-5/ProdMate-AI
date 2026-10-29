/**
 * Legal pages, copied from the chat app (chat-page/app/privacy, terms, cookies) so the footer links
 * stay on the marketing site and match its theme.
 */

export type LegalBlock = string | { term: string; text: string };
export type LegalSection = { id: string; title: string; body: LegalBlock[]; email?: string };
export type LegalDoc = {
  slug: "privacy" | "terms" | "cookies";
  title: [string, string];
  description: string;
  updated: string;
  sections: LegalSection[];
};

const updated = "June 27, 2026";

export const privacy: LegalDoc = {
  slug: "privacy",
  title: ["Privacy", "Policy"],
  description: "How ProdMate collects, uses and protects your information.",
  updated,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [
        'ProdMate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our developer platform and AI services.',
      ],
    },
    {
      id: "information",
      title: "Information we collect",
      body: [
        "We collect information through two primary channels to ensure optimal performance and security of our workspace environment:",
        {
          term: "Account and identity",
          text: "Email, name, and necessary registration details to establish your workspace and prevent unauthorized access.",
        },
        {
          term: "Telemetry and quotas",
          text: "Interactions with AI assistants strictly to manage compute resources, token quotas, and system reliability.",
        },
        {
          term: "Project artifacts",
          text: "The architecture, code, and specifications generated within your private sessions.",
        },
      ],
    },
    {
      id: "security",
      title: "Data security and storage",
      body: [
        "Your data is protected by industry standard technical measures. We utilize encryption for sensitive data in transit, secure server architectures, and routine access audits.",
        {
          term: "Model training policy",
          text: "Your project data, code snippets, and proprietary architectures are completely isolated. They are never used to train our generalized AI models without your explicit, opt in consent.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact information",
      body: [
        'If you have questions regarding your data, GDPR compliance, or wish to exercise your "Right to be Forgotten," our privacy engineering team is available directly at:',
      ],
      email: "privacy@prodmate.dev",
    },
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: ["Terms of", "Service"],
  description: "The agreement that applies when you use ProdMate.",
  updated,
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of terms",
      body: [
        'By accessing and using ProdMate ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
      ],
    },
    {
      id: "description",
      title: "Description of service",
      body: [
        "ProdMate is a developer platform that provides AI powered planning assistance, project management tools, and collaborative workspace features. The service is offered on a subscription basis with different tiers available.",
      ],
    },
    {
      id: "accounts",
      title: "User accounts and responsibilities",
      body: [
        "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You are solely responsible for all activities that occur under your account.",
      ],
    },
    {
      id: "payment",
      title: "Payment and subscription terms",
      body: [
        "Subscription fees are charged in advance on a monthly or annual basis. All fees are non refundable except as required by law. We reserve the right to change our subscription fees at any time with 30 days notice.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual property rights",
      body: [
        "You retain ownership of all intellectual property rights in the code and content you create using our service. We retain ownership of all rights to the ProdMate platform, software, and proprietary technology.",
      ],
    },
    {
      id: "prohibited",
      title: "Prohibited uses",
      body: [
        "You may not use our service for any illegal or unauthorized purpose. You may not use our service to develop malicious software, violate intellectual property rights, or engage in activities that harm others or our platform.",
      ],
    },
    {
      id: "availability",
      title: "Service availability",
      body: [
        "We strive to maintain high service availability but do not guarantee uninterrupted access. Support levels vary by subscription tier.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: [
        "To the maximum extent permitted by law, ProdMate shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      body: [
        "We may terminate or suspend your account at any time for violation of these terms. You may cancel your subscription at any time through your account settings.",
      ],
    },
    {
      id: "changes",
      title: "Changes to terms",
      body: [
        "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any modified terms.",
      ],
    },
    {
      id: "contact",
      title: "Contact details",
      body: ["If you have any questions about these Terms of Service, please contact us at:"],
      email: "legal@prodmate.dev",
    },
  ],
};

export const cookies: LegalDoc = {
  slug: "cookies",
  title: ["Cookie", "Policy"],
  description: "How ProdMate uses cookies and similar technologies.",
  updated,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [
        'This Cookie Policy explains how ProdMate ("we," "our," or "us") uses cookies and similar tracking technologies when you access our developer platform and AI workspace. By using our service, you consent to the use of cookies as described in this policy.',
      ],
    },
    {
      id: "usage",
      title: "How we use cookies",
      body: [
        "We use cookies to maintain secure user authentication, remember your workspace preferences, ensure session continuity, and monitor system performance. Cookies allow us to deliver a fast, reliable, and personalized AI development environment without compromising security.",
      ],
    },
    {
      id: "types",
      title: "Types of cookies we use",
      body: [
        "Our platform relies on three distinct categories of cookies:",
        {
          term: "Essential cookies",
          text: "Required for authentication and core security. These tokens keep you signed in securely via Clerk and protect your workspace against unauthorized requests.",
        },
        {
          term: "Preference cookies",
          text: "Used to remember your customized settings, UI layouts, theme selections, and active project preferences across sessions.",
        },
        {
          term: "Performance and telemetry cookies",
          text: "Help us measure API latency, token quota consumption, and resource utilization to maintain system reliability and prevent downtime.",
        },
      ],
    },
    {
      id: "managing",
      title: "Managing your cookies",
      body: [
        "Most web browsers allow you to control or disable cookies through their settings preferences. However, please note that disabling essential authentication cookies will prevent you from logging into your ProdMate workspace or accessing AI services.",
      ],
    },
    {
      id: "contact",
      title: "Contact information",
      body: [
        "If you have any questions or concerns about our use of cookies or tracking technologies, please reach out to our privacy engineering team at:",
      ],
      email: "privacy@prodmate.dev",
    },
  ],
};

export const legalDocs = [terms, privacy, cookies] as const;
