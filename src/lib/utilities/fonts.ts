import localFont from "next/font/local";

export const aktivGroteskFont = localFont({
  // display: "swap",
  variable: "--font-aktiv-grotesk",
  src: [
    {
      path: "../../fonts/AktivGrotesk-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/AktivGrotesk-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/AktivGrotesk-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export const ridleyGroteskFont = localFont({
  display: "swap",
  variable: "--font-ridley-grotesk",
  src: [
    {
      path: "../../fonts/RidleyGrotesk-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/RidleyGrotesk-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/RidleyGrotesk-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/RidleyGrotesk-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});
