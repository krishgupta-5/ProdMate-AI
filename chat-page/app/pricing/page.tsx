import { redirect } from "next/navigation";

import { LANDING_URL } from "@/lib/site";

export default function PricingPage() {
  redirect(`${LANDING_URL}/#pricing`);
}
