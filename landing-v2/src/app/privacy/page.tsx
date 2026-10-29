import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/legal-page";
import { privacy } from "@/content/legal";

export const metadata: Metadata = { title: "Privacy Policy", description: privacy.description };

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
