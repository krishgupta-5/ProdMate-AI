import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/legal-page";
import { cookies } from "@/content/legal";

export const metadata: Metadata = { title: "Cookie Policy", description: cookies.description };

export default function CookiesPage() {
  return <LegalPage doc={cookies} />;
}
