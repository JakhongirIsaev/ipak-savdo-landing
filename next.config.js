/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://mc.yandex.ru https://yastatic.net",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://mc.yandex.ru https://yandex.ru",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://mc.yandex.ru https://*.mc.yandex.ru wss://mc.yandex.ru",
      "frame-src 'self' blob: https://mc.yandex.ru",
      "child-src 'self' blob: https://mc.yandex.ru",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Serve modern formats from next/image automatically. AVIF is tried first
  // (smallest), with WebP as the fallback, and the original JPG/PNG as the last
  // resort for browsers that support neither. No source files change; the
  // optimizer transcodes on the fly.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // The premium concept is now the live homepage; the old preview URL folds into it.
      { source: "/concept", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
