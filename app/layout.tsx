import type { Metadata, Viewport } from "next";
import { Sora, Manrope, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
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

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Handwriting face for the paper-ledger comparison block only.
const caveat = Caveat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-hand",
  display: "swap",
});

// Default (fallback) metadata — each locale page (app/page.tsx = uz, app/ru/page.tsx = ru)
// overrides title/description/openGraph/alternates with its own localized values.
export const metadata: Metadata = {
  metadataBase: new URL("https://birliy.uz"),
  title: "BirLiy: do'kon uchun kassa, ombor va QR to'lov dasturi",
  description:
    "BirLiy: kassa, ombor hisobi, QR to'lov va hisobotlar bitta ilovada.",
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
        <VisitorBeacon />
      </body>
    </html>
  );
}
