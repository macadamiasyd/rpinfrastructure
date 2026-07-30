import type { AcfStorySection } from "@/graphql/generated/graphql";

import MediaImage from "@/components/shared/media/image";

function Quote({ quote, inertia = 0.3 }: { quote: string; inertia?: number }) {
  return (
    <div
      className="StorySection-pullQuote ParalaxElements"
      data-inertia={inertia}
      dangerouslySetInnerHTML={{ __html: quote }}
    />
  );
}

export default function StorySectionBlock({ attributes, storySection }: AcfStorySection) {
  const title = storySection?.title ?? "";
  const contentHtml = storySection?.content ?? "";
  const quote = (storySection?.quote ?? "").trim();
  const imgEdge = storySection?.images?.edges?.[0] ?? null;
  const img = imgEdge?.node ?? null;

  const hasImage = Boolean(img && img.guid);
  const hasQuote = Boolean(quote);
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const isReverseLayout = storySection?.reverseLayout ?? false;
  const reverseLayoutClass = isReverseLayout ? ` StorySection--reverseLayout` : "";

  const ratio =
    img?.mediaDetails?.height && img?.mediaDetails?.width
      ? Math.round((img.mediaDetails.height / img.mediaDetails.width) * 100)
      : 62;
  const paddingBottom = `${ratio}%`;

  if (hasQuote && hasImage) {
    return (
      <section className={`StorySection${extraClass}${reverseLayoutClass}`}>
        <div className="row">
          <div className="columns large-7 StorySection-pullQuoteContainer u-spaceAfterHuge">
            <Quote quote={quote} inertia={0.5} />
          </div>
          <div className="columns large-6 large-offset-2">
            {title && <h2 className="StorySection-header">{title}</h2>}
            {contentHtml && (
              <div className="rte" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            )}
            <div className="LazyLoad" style={{ paddingBottom }}>
              {img && (
                <MediaImage
                  {...img}
                  className="u-bounceUp LazyLoad-image"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hasQuote && !hasImage) {
    return (
      <section className={`StorySection space-between row${extraClass}${reverseLayoutClass}`}>
        <div
          className={`columns large-${isReverseLayout ? "6" : "7"} end StorySection-pullQuoteContainer u-spaceAfterHuge`}
        >
          <Quote quote={quote} inertia={0.1} />
        </div>
        <div className="columns large-5 large-offset-1">
          {title && <h2 className="StorySection-header">{title}</h2>}
          {contentHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
        </div>
      </section>
    );
  }

  if (hasImage) {
    return (
      <section className={`StorySection row${extraClass}${reverseLayoutClass}`}>
        {/* Reversed sections use the current site's column split (5 / 7 with a
            one-column indent) so the image sits flush against the copy. */}
        <div className={isReverseLayout ? "columns large-5" : "columns large-5 large-offset-2"}>
          {title && <h2 className="StorySection-header">{title}</h2>}
          {contentHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
        </div>
        <div
          className={
            isReverseLayout ? "columns large-7 large-offset-1" : "columns large-6 large-offset-1 end"
          }
        >
          <div className="LazyLoad" style={{ paddingBottom }}>
            {img && (
              <MediaImage
                {...img}
                className="u-bounceUp LazyLoad-image"
                priority
                loading="eager"
                fetchPriority="high"
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`StorySection row${extraClass}${reverseLayoutClass}`}>
      <div className="columns large-5 large-offset-2">
        {title && <h2 className="StorySection-header">{title}</h2>}
        {contentHtml && <div className="rte" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
      </div>
    </section>
  );
}
