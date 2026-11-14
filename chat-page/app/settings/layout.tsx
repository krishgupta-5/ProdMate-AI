import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

// Settings is for signed-in users only. Signed-out visitors get the 401 page (app/unauthorized.tsx).
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) unauthorized();
  return children;
}
