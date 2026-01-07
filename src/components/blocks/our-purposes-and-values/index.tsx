"use client";

import type { AcfOurPurposeAndValues, MediaItem } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function OurPurposesAndValues(props: AcfOurPurposeAndValues) {
  const cls = props.attributes?.className ? ` ${props.attributes.className}` : "";
  const data = props.ourPurposesAndValues;
  if (!data) return null;

  const heading = data.heading ?? "";
  const upperContent = data.upperContent ?? "";
  const ourPurposeHeading = data.ourPurposeHeading ?? "";
  const ourValuesHeading = data.ourValuesHeading ?? "";
  const purposeImage = data.purposeImage?.node ?? null;
  const purposeList = (data.purposeList ?? []).filter(Boolean) as Array<{
    title?: string | null;
    content?: string | null;
  }>;

  return (
    <section className={`row cus_purpose_allsec${cls}`}>
      <div className="column">
        {heading && (
          <div className="expertise_wrap_head">
            <h1 dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />
          </div>
        )}

        {upperContent && (
          <div className="Page-body rte cus_new_sec_content">
            <div className="rte" dangerouslySetInnerHTML={{ __html: sanitizeHTML(upperContent) }} />
          </div>
        )}

        {ourPurposeHeading && (
          <div className="Page-body rte cus_new_sec_head">
            <h2 dangerouslySetInnerHTML={{ __html: sanitizeHTML(ourPurposeHeading) }} />
          </div>
        )}

        {purposeImage && (
          <div className="Page-body rte cus_new_sec_img">
            <MediaImage {...(purposeImage as MediaItem)} loading="lazy" />
          </div>
        )}

        <div className="image_list_cussec_purpose">
          {purposeList.map((item, i) => (
            <div className="new_cus_column" key={i}>
              {item.title && (
                <div className="cus_block_headsec">
                  <h3 dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.title) }} />
                </div>
              )}
              {item.content && (
                <div
                  className="cus_con"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.content) }}
                />
              )}
            </div>
          ))}
        </div>

        {ourValuesHeading && (
          <div className="cus_new_sec_head_below">
            <h2 dangerouslySetInnerHTML={{ __html: sanitizeHTML(ourValuesHeading) }} />
          </div>
        )}
      </div>
    </section>
  );
}
