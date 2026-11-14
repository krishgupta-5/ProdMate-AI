import { Inter } from "next/font/google";

// Inter, the same typeface as the landing page.
export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

// Older components put `satoshi.variable` on their root and read `var(--font-satoshi)`.
// globals.css maps --font-satoshi to Inter, so this alias keeps them on the same font.
export const satoshi = inter;
