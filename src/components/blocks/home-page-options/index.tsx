import type { AcfHomePageOptions } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

export default function HomePageOptionsBlock({ homePageOptions }: AcfHomePageOptions) {
  if (!homePageOptions || !homePageOptions.homePageHeading) return null;

  return (
    <div
      className="columns Home-pullQuote u-spaceAfterHuge"
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(homePageOptions.homePageHeading) }}
    />
  );
}
