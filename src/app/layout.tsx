import "@/styles/main.scss";
import "@/styles/main.min.css";
import "@/styles/custom.css";
import "@/styles/style.css";

import { Suspense } from "react";
import { aktivGroteskFont, ridleyGroteskFont } from "@/lib/utilities/fonts";
import { getFooterLocations } from "@/lib/utilities/footerLocations";
import { getSiteSettings } from "@/lib/utilities/querySiteSettings";
import { clsx } from "clsx";

import Icons from "@/components/shared/icons";
import Analytics from "@/components/analytics";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PortfolioFilterMemory from "@/components/portfolio-filter-memory.client";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, footerLocations] = await Promise.all([
    getSiteSettings(),
    getFooterLocations(),
  ]);

  // Header and Footer render whether or not the theme settings arrived. The
  // navigation comes from a separate menu query, so guarding the whole
  // component on this one payload meant a single backend hiccup took the menu,
  // the banner and the footer off every page at once — which is exactly what
  // happened on 2026-09-09. Both components null-guard every option they read,
  // so the worst case is now a plain header with a working menu rather than a
  // page with no way out of it. getSiteSettings() logs loudly when this
  // happens; nothing is surfaced to the visitor.
  const themeOptions = siteSettings?.themeSettings?.themeOptions ?? {};

  return (
    <html lang="en" className={clsx(aktivGroteskFont.variable, ridleyGroteskFont.variable)}>
      <body id="page-top">
        <Analytics />
        <a href="#main-content" className="u-skipLink">
          Skip to main content
        </a>
        <a href="#navMain" className="u-skipLink">
          Skip to main navigation
        </a>
        <Icons />
        <Suspense fallback={null}>
          <PortfolioFilterMemory />
        </Suspense>
        <Header {...themeOptions} />
        <main id="main-content">{children}</main>
        <Footer {...themeOptions} locations={footerLocations} />
      </body>
    </html>
  );
}
