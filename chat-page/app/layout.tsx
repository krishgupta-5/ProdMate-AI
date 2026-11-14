import type { Metadata, Viewport } from "next";
import { inter } from "@/constants";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face" });

// Same favicon set as the landing page (landing-page/index.html): an SVG that follows the browser
// theme, with PNG fallbacks for light and dark.
export const metadata: Metadata = {
  title: {
    default: "ProdMate",
    template: "%s | ProdMate",
  },
  description: "AI-powered platform for creators and businesses.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark-16x16.png", sizes: "16x16", type: "image/png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-dark-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-dark-48x48.png", sizes: "48x48", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${geistMono.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking on purpose: sets the saved light/dark class before the first paint, so a dark-theme
            user never sees the light page flash first (lib/theme-script.ts). */}
        {/* suppressHydrationWarning: browser extensions inject their own <script> tags into <head>
            before React loads, which React would otherwise report as a mismatch on this tag. */}
        <script id="pm-theme-init" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#6c5ce7",
              colorDanger: "#dc2626",
              fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
              borderRadius: "0.75rem",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
