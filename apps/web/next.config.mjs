import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import { withPlausibleProxy } from "next-plausible";

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(" ");
  if (
    message.includes("Package mongodb can't be external") ||
    message.includes("Package pg can't be external") ||
    message.includes("Package sqlite3 can't be external") ||
    message.includes("Package typeorm can't be external") ||
    message.includes("matches serverExternalPackages") ||
    message.includes("Try to install it into the project directory")
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

const withPlausible = withPlausibleProxy({
  src: "https://plausible.io/js/pa-T9BPIqC3D0XQFZnP1vHfN.js",
  scriptPath: "/_proxy/plausible/script.js",
  apiPath: "/_proxy/plausible/event",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    "prettier",
    "shiki",
    "@dub/prisma",
    "@dub/email",
    "@dub/utils",
    "@dub/ui",
    "@boxyhq/saml-jackson",
  ],
  outputFileTracingIncludes: {
    "/api/auth/saml/token": [
      "./node_modules/jose/**/*",
      "./node_modules/openid-client/**/*",
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@dub/email",
      "@dub/ui",
      "@team-plain/typescript-sdk",
    ],
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  webpack: (config, { webpack, isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^@sap\/hana-client\/extension\/Stream$|^snappy$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        }),
      );

      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
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
      {
        source: "/embed/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "app.dub.sh" }],
        destination: "https://app.vtrack.io",
        permanent: true,
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "app.dub.sh" }],
        destination: "https://app.vtrack.io/:path*",
        permanent: true,
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host", value: "staging.dub.sh" }],
        destination: "https://vtrack.io",
        permanent: true,
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host", value: "preview.dub.sh" }],
        destination: "https://preview.dub.co",
        permanent: true,
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host", value: "admin.dub.sh" }],
        destination: "https://admin.dub.co",
        permanent: true,
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/_proxy/dub/script.js",
        destination: "https://www.dubcdn.com/analytics/script.js",
      },
      {
        source: "/_proxy/dub/track/:path*",
        destination: "https://api.dub.co/track/:path*",
      },
    ];
  },
};

export default withPlausible(nextConfig);
