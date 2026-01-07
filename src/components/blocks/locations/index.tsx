import type { AcfLocations } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";
import clsx from "clsx";

import LocationMap from "./map";

export default function LocationsBlock({ attributes, locations }: AcfLocations) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const items = (locations?.locations || []).filter(Boolean);

  if (!items || items.length === 0) return null;

  return (
    <section className="u-wrap Contact">
      <div className={clsx("row u-spaceAfterHuge custom_contact_sec is-inView", extraClass)}>
        {items.map((loc, idx) => {
          const city = loc?.city || "";
          const addressHtml = loc?.address || "";
          const email = loc?.email || "";

          return (
            <div key={idx} className="cus_con_block">
              <LocationMap {...loc} />
              {city && <h2 className="Contact-title is-inView">{city}</h2>}
              {(addressHtml || email) && (
                <div className="Contact-body rte">
                  {addressHtml && (
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(addressHtml) }} />
                  )}
                  {email && (
                    <p>
                      <a href={`mailto:${email}?subject=Enquiry%20for%20${city}`}>Email Us</a>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
