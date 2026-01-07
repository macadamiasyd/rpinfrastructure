import Link from "next/link";
import type { AcfBannerText, MediaItem } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function BannerTextBlock(props: AcfBannerText) {
  const { attributes, bannerWithText } = props;
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";

  const heading = bannerWithText?.heading;
  const link = bannerWithText?.link;
  const img = bannerWithText?.image?.node as MediaItem | null;

  return (
    <section className={`Banner Banner--static${extraClass}`}>
      <div className="Banner-caption">
        <div className="row">
          <div className="column">
            {heading && (
              <h3
                className="Banner-text u-staggerIn"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(heading),
                }}
              />
            )}
            {link?.url && (
              <Link
                className="Banner-cta u-staggerIn js-btnNextSection button-show"
                target={link.target ?? "_self"}
                href={link.url}
              >
                <span>{link.title ?? "Learn more"}</span>
                <svg className="Icon Icon-arrow-right">
                  <use xlinkHref="#icon-arrow-right" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
      {img && (
        <MediaImage
          {...img}
          priority
          loading="eager"
          fetchPriority="high"
          className="Banner-image img-cover"
        />
      )}
    </section>
  );
}
