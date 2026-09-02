import type { NextConfig } from "next";

import { legacyNewsRedirects } from "./src/lib/redirects";

/**
 * Hosts that may serve next/image sources.
 *
 * Media lives on the WordPress backend, which is a different host from the
 * frontend in production (admin.rpinfrastructure.com.au vs
 * rpinfrastructure.com.au). Listing every configured host means images keep
 * working when the domains are switched over, rather than silently 400ing
 * because only one of them was allow-listed.
 */
const imageHosts = [
  process.env.API_DOMAIN,
  process.env.SITE_DOMAIN,
  process.env.FRONTEND_DOMAIN,
].filter((host): host is string => !!host && host.trim() !== "");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [25, 50, 75, 100],
    remotePatterns: [...new Set(imageHosts)].map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  // The build prerenders ~280 pages, each hitting WordPress. That backend's
  // response time swings from sub-second to ~20s under the load of parallel
  // build workers, so the 60s default trips on a handful of pages every time —
  // and when all three attempts land in a slow patch the whole build fails.
  // Nineteen of the last hundred deployments died this way.
  staticPageGenerationTimeout: 180,
  experimental: {
    inlineCss: true,
  },
  async redirects() {
    return legacyNewsRedirects;
  },
};

export default nextConfig;
