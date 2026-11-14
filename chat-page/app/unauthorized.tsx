import type { Metadata } from "next";
import ErrorScreen from "./chat/components/ErrorScreen";

export const metadata: Metadata = {
  title: "Sign in required",
};

// Rendered with a 401 status whenever a page calls unauthorized() (e.g. app/settings/layout.tsx).
export default function Unauthorized() {
  return <ErrorScreen code="401" />;
}
