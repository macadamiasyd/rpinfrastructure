import "@/styles/main.scss";
import "@/styles/main.min.css";
import "@/styles/custom.css";
import "@/styles/style.css";

import { Suspense } from "react";
import { aktivGroteskFont, ridleyGroteskFont } from "@/lib/utilities/fonts";
import { getSiteSettings } from "@/lib/utilities/querySiteSettings";
import { clsx } from "clsx";

import Icons from "@/components/shared/icons";
import PortfolioFilterMemory from "@/components/portfolio-filter-memory.client";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" className={clsx(aktivGroteskFont.variable, ridleyGroteskFont.variable)}>
      <body id="page-top">
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
            locationsOld={siteSettings.themeSettings.locationsOld?.locations ?? []}
          />
        )}
      </body>
    </html>
  );
}
