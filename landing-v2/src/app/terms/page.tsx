import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = { title: "Terms of Service", description: terms.description };

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
