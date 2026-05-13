/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    "prettier",
    "@dub/prisma",
    "@dub/utils",
    "@dub/ui",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
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