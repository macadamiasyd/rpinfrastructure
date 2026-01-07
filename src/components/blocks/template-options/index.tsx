import type { AcfTemplateOptions } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function TemplateOptionsBlock({ attributes, templateOptions }: AcfTemplateOptions) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const tpl = templateOptions;

  if (!tpl) return null;

  const heading = tpl.heading ?? "";
  const subheading = tpl.subheading ?? "";
  const contentHtml = tpl.content ?? "";
  const heroImg = tpl.image?.node ?? null;
  const imageList = (tpl.imageList || []).filter(Boolean);
  const isHeadRender = heading || subheading || contentHtml || heroImg;

  return (
    <div className="new_custom_template">
      <article className={`row cus_expert_sec${extraClass}`}>
        {isHeadRender && (
          <div className="expertise_wrap_head">
            {!!heading && <h1 dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />}
          </div>
        )}

        <div className="cus_template_right">
          {heroImg && (
            <div className="img_sec_cus">
              <MediaImage {...heroImg} />
            </div>
          )}
          <div className="u-bounceUp is-inView">
            <div className="row">
              <div className="Post-main has-no-standfirst">
                {!!subheading && (
                  <h2 dangerouslySetInnerHTML={{ __html: sanitizeHTML(subheading) }} />
                )}
                <div className="Page-body cus_new_sec">
                  {contentHtml && (
                    <div
                      className="rte"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(contentHtml) }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {imageList.length > 0 && (
          <div className="image_list_cussec">
            {imageList.map((item, idx) => {
              const img = item?.img?.node ?? null;
              if (!img) return null;
              return (
                <div key={`tpl-img-${idx}`} className="new_cus_column">
                  <div className="LazyLoad">
                    <MediaImage {...img} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
}
