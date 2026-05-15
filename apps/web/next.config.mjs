/** @type {import('next').NextConfig} */
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  transpilePackages: [
    "@dub/prisma",
    "@dub/utils",
    "@dub/ui",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    outputFileTracingExcludes: {
      '*': [
        // Partner system
        '**/partners.dub.co/**/*',
        '**/api/partners/**/*',
        '**/api/programs/**/*',
        '**/api/bounties/**/*',
        '**/api/campaigns/**/*',
        '**/api/commissions/**/*',
        // Cron jobs
        '**/api/cron/**/*',
        // Payments
        '**/api/stripe/**/*',
        '**/api/paypal/**/*',
        '**/api/payouts/**/*',
        '**/invoices/**/*',
        // Admin avanzado
        '**/admin.dub.co/(dashboard)/analytics/**/*',
        '**/admin.dub.co/(dashboard)/commissions/**/*',
        '**/admin.dub.co/(dashboard)/partners/**/*',
        '**/admin.dub.co/(dashboard)/payouts/**/*',
        '**/admin.dub.co/(dashboard)/programs/**/*',
        '**/admin.dub.co/(dashboard)/revenue/**/*',
        '**/admin.dub.co/(dashboard)/events/**/*',
        '**/api/admin/**/*',
        // Integrations
        '**/api/hubspot/**/*',
        '**/api/shopify/**/*',
        '**/api/slack/**/*',
        '**/api/singular/**/*',
        '**/api/appsflyer/**/*',
        '**/api/scim/**/*',
        // E2E y Mock
        '**/api/e2e/**/*',
        '**/api/mock/**/*',
        // Features no esenciales
        '**/api/audit-logs/**/*',
        '**/api/fraud/**/*',
        '**/api/embed/**/*',
        '**/api/network/**/*',
        '**/api/workflows/**/*',
        '**/api/rewards/**/*',
        '**/api/groups/**/*',
        '**/api/discount-codes/**/*',
        '**/api/email-domains/**/*',
        '**/api/messages/**/*',
        '**/api/partner-profile/**/*',
        '**/api/track/**/*',
      ],
    },
  },
  images: {
    remotePatterns: [
      { hostname: "assets.dub.co" },
      { hostname: "dubassets.com" },
      { hostname: "dev.dubassets.com" },
      { hostname: "www.google.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "faisalman.github.io" },
      { hostname: "api.dicebear.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "media.cleanshot.cloud" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;