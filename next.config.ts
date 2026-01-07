import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.SITE_DOMAIN ?? "",
      },
    ],
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
