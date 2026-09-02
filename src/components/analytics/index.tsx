import Script from "next/script";

/**
 * Google Analytics.
 *
 * The previous site loaded gtag.js from a WordPress plugin in the theme output.
 * The headless frontend never carried that across, so from the domain cutover
 * onward the site reported nothing at all — which is what the client saw as
 * their metrics "dropping". This restores the same GA4 property and the same
 * loading pattern the old site used.
 *
 * Renders nothing unless GA_MEASUREMENT_ID is set, so preview and local builds
 * stay out of the client's reporting.
 */
export default function Analytics() {
  const id = process.env.GA_MEASUREMENT_ID;

  if (!id || process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
