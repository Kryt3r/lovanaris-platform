import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers für alle Routen
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Verhindert Clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Verhindert MIME-Type Sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer-Informationen minimieren
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Kein Zugriff auf Browser-Features die wir nicht brauchen
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS: Nur HTTPS, 1 Jahr, inkl. Subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js braucht unsafe-eval in Dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' http://localhost:3000 https://einfachrobin.de",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
