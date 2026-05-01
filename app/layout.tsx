import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ipak Savdo — касса, склад и QR-оплата для малого бизнеса",
  description:
    "Мобильное приложение для малого бизнеса: касса, склад, QR-оплата, электронный чек и отчеты со смартфона или планшета.",
  openGraph: {
    title: "Ipak Savdo — касса, склад и QR-оплата",
    description:
      "Продавайте быстрее, контролируйте остатки и принимайте оплату по QR в одном приложении.",
    type: "website",
    images: ["/og-ipak-savdo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#005B45",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
