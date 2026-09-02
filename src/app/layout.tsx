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
import PortfolioFilterMemory from "@/components/portfolio-filter-memory.client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Analytics from "@/components/analytics";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, footerLocations] = await Promise.all([
    getSiteSettings(),
    getFooterLocations(),
  ]);

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
        {siteSettings?.themeSettings && <Header {...siteSettings.themeSettings.themeOptions} />}
        <main id="main-content">{children}</main>
        {siteSettings?.themeSettings && (
          <Footer
            {...siteSettings.themeSettings.themeOptions}
            locations={footerLocations}
          />
        )}
      </body>
    </html>
  );
}
