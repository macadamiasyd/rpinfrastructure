import type { AcfBannerImage } from "@/graphql/generated/graphql";

import MediaImage from "@/components/shared/media/image";

export default function BannerImageBlock({ bannerImage, attributes }: AcfBannerImage) {
  const img = bannerImage?.image?.node ?? null;

  const hasImage = Boolean(img && img.sourceUrl);
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const fixedPosition = Boolean(bannerImage?.fixedPosition);

  if (fixedPosition && hasImage)
    return (
      <div
        className="StorySection StorySection--banner"
        style={{ backgroundImage: `url(${img?.sourceUrl ?? ""})` }}
      >
        <img src={img?.sourceUrl ?? ""} alt={img?.altText ?? ""} />
      </div>
    );

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
              className="Banner-image"
            />
          )}
        </div>
      )}
    </section>
  );
}
