import type { Metadata } from "next";
import ErrorScreen from "./chat/components/ErrorScreen";

export const metadata: Metadata = {
  title: "Page not found",
};

// Rendered with a 404 status for unknown URLs and whenever a page calls notFound().
export default function NotFound() {
  return <ErrorScreen code="404" />;
}
