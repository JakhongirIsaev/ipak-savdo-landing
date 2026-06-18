import type { Metadata, Viewport } from "next";
import { Sora, Manrope, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { YandexMetrika } from "@/components/YandexMetrika";
import { VisitorBeacon } from "@/components/VisitorBeacon";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Mono face is used by the self-printing receipt only, below the fold:
// keep it off the critical path so it never competes with the hero image.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

// Handwriting face for the paper-ledger comparison block only, below the
// fold as well.
const caveat = Caveat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

// Default (fallback) metadata — each locale page (app/page.tsx = uz, app/ru/page.tsx = ru)
// overrides title/description/openGraph/alternates with its own localized values.
export const metadata: Metadata = {
  metadataBase: new URL("https://birliy.uz"),
  title: "BirLiy: do'kon uchun kassa, ombor va QR to'lov dasturi",
  description:
    "BirLiy: kassa, ombor hisobi, QR to'lov va hisobotlar bitta ilovada.",
  alternates: {
    types: { "application/rss+xml": "https://birliy.uz/feed.xml" },
  },
  // Search-engine ownership verification. Set these env vars to the tokens
  // Yandex Webmaster / Google Search Console give you; until then nothing is
  // rendered. Inherited by every page (locale pages don't override verification).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "hsbWtLtcG8YCe2unHP93eBGdi8x0tc5Rdq2DXrMPytk",
    yandex: process.env.YANDEX_VERIFICATION || "9edd4bcada30a5c7",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03B73D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${jetbrains.variable} ${caveat.variable}`}
    >
      <body>
        {/* Marks JS as available before content paints, so scroll-reveal
            (globals.css `.reveal`) hides nothing for no-JS users. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-reveal','on')",
          }}
        />
        {children}
        <Analytics />
        <YandexMetrika />
        <VisitorBeacon />
      </body>
    </html>
  );
}
