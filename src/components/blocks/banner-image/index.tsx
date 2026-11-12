import type { AcfBannerImage } from "@/graphql/generated/graphql";
import { optimizedImageUrl } from "@/lib/utilities/optimizedImageUrl";

import MediaImage from "@/components/shared/media/image";

export default function BannerImageBlock({ bannerImage, attributes }: AcfBannerImage) {
  const img = bannerImage?.image?.node ?? null;

  const hasImage = Boolean(img && img.sourceUrl);
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const fixedPosition = Boolean(bannerImage?.fixedPosition);

  if (fixedPosition && hasImage) {
    // The visible imagery is the CSS background: it needs
    // background-attachment: fixed for the parallax, which an element can't
    // give us, so it goes through the optimizer by URL rather than next/image.
    //
    // This used to point at the full-size original — 5.8MB on /about — and
    // carried an `img` alongside it, opacity:0 in _story-section.scss, purely
    // to lend the container its height. That invisible img was expensive in a
    // non-obvious way: React emits a preload hint for it, hints travel in the
    // prefetched RSC payload, and every page prefetches /about from the nav —
    // so all 5.8MB was fetched on every page view, for an image that renders
    // on one page. Deriving the height from the intrinsic ratio instead means
    // no element, no hint, and the background loads only when it is displayed.
    const banner = optimizedImageUrl(img?.sourceUrl ?? "");
    const width = Number(img?.mediaDetails?.width) || 0;
    const height = Number(img?.mediaDetails?.height) || 0;
    const hasRatio = width > 0 && height > 0;

    return (
      <div
        className="StorySection StorySection--banner"
        style={{
          backgroundImage: `url("${banner}")`,
          ...(hasRatio ? { aspectRatio: `${width} / ${height}` } : {}),
        }}
      >
        {/* Only where WordPress gave us no dimensions to work from. */}
        {!hasRatio && <img src={banner} alt={img?.altText ?? ""} />}
      </div>
    );
  }

  return (
    <section className={`Banner Banner--static${hasImage ? "" : " has-no-image"}${extraClass}`}>
      {hasImage && (
        <div className="Banner-slide">
          {img && (
            <MediaImage
              {...img}
              priority
              loading="eager"
              fetchPriority="high"
              responsiveSizes="100vw"
              className="Banner-image"
            />
          )}
        </div>
      )}
    </section>
  );
}
