import type { MetadataRoute } from "next";

/**
 * The site had no robots.txt at all — /robots.txt returned a 404 page.
 *
 * Preview and staging hosts must not be indexed, or they compete with the real
 * domain for the same content. Anything that is not the configured production
 * frontend is disallowed outright; only the real domain gets a crawlable
 * robots.txt with the sitemaps attached.
 */
export default function robots(): MetadataRoute.Robots {
  const base = (process.env.PUBLIC_URL || process.env.FRONTEND_URL || "").replace(/\/$/, "");
  const isProduction = process.env.VERCEL_ENV === "production" && base.endsWith("rpinfrastructure.com.au");

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/preview", "/search"],
    },
    sitemap: [`${base}/sitemap.xml`, `${base}/news/sitemap.xml`],
    host: base,
  };
}
