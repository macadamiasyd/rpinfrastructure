import type { AcfExpertiseOptions } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import CollapsibleHtml from "@/components/shared/collapsible-html";
import MediaImage from "@/components/shared/media/image";

export default function ExpertiseOptionsBlock({
  attributes,
  expertiseOptions,
}: AcfExpertiseOptions) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const exp = expertiseOptions;

  if (!exp) return null;

  const heading = exp.heading ?? "";
  const upperContentHtml = exp.upperContent ?? "";
  const items = (exp.expertiseList || []).filter(Boolean);
  const showHead = Boolean(heading || upperContentHtml);
  const isCollapsible = Boolean(exp?.isCollapsible);

  return (
    <section className={`row cus_expert_sec${extraClass}`}>
      {showHead && (
        <div className="expertise_wrap_head">
          {!!heading && <h1 dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />}
          {upperContentHtml && (
            <div className="cus_new_sec_content">
              <div className="content_area">
                <div
                  className="rte"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(upperContentHtml) }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className={`image_list_cussec${exp?.twoColumnsLayout ? " two_columns_layout" : ""}`}>
          {items.map((item, idx) => {
            const img = item?.image?.node ?? null;
            const title = item?.title ?? "";
            const contentHtml = item?.content ?? "";
            const buttonLabel = item?.buttonLabel ?? "";
            const buttonLink = item?.buttonLink ?? "";

            return (
              <div key={`expertise-${idx}`} className="new_cus_column">
                {img && (
                  <div className="LazyLoad">
                    <MediaImage {...img} />
                  </div>
                )}
                {(title || contentHtml || buttonLabel) && (
                  <div className="cus_new_sec_content">
                    {title && <h3>{title}</h3>}
                    {contentHtml && (
                      <CollapsibleHtml
                        html={contentHtml}
                        isCollapsible={isCollapsible}
                        extraClass={items.length <= 3 ? " Tile-content" : ""}
                      />
                    )}
                    {buttonLabel && buttonLink && (
                      <p>
                        <a className="Button Button--primary" href={buttonLink}>
                          {buttonLabel}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
