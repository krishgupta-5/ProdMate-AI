import { Geist_Mono, Space_Grotesk } from "next/font/google";

/** Interface typeface for the landing page and the chat workspace. */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/** Code, file names and numeric UI only. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
