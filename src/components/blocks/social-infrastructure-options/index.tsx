import type { AcfSocialInfrastructureOptions } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function SocialInfrastructureOptionsBlock({
  attributes,
  socialInfrastructureOptions,
}: AcfSocialInfrastructureOptions) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const data = socialInfrastructureOptions;

  if (!data) return null;

  const heading = data.heading ?? "";
  const items = (data.infrastructureList || []).filter(Boolean);

  return (
    <section className={`row u-insetWrap cus_expert_sec${extraClass}`}>
      {!!heading && (
        <div className="expertise_wrap_head">
          <h1 dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />
        </div>
      )}

      {items.length > 0 && (
        <div className="image_list_cussec">
          {items.map((item, idx) => {
            const img = item?.image?.node ?? null;
            const title = item?.title ?? "";
            const contentHtml = item?.content ?? "";
            const buttonLabel = item?.buttonLabel ?? "";
            const buttonLink = item?.buttonLink ?? "";

            return (
              <div key={`social-infra-${idx}`} className="new_cus_column">
                {img && (
                  <div className="LazyLoad">
                    <MediaImage {...img} />
                  </div>
                )}
                {(title || contentHtml || buttonLabel) && (
                  <div className="cus_new_sec_content">
                    {title && <h3>{title}</h3>}
                    {contentHtml && (
                      <div
                        className="rte"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(contentHtml) }}
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
