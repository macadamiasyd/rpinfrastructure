"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AcfMediaItemConnectionEdge } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

type Props = {
  name?: string | null;
  position?: string | null;
  status?: string | null;
  details?: string | null;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  image?: AcfMediaItemConnectionEdge | null;
};

export default function MemberCard({
  name,
  position,
  details,
  image,
  email,
  phone,
  linkedinUrl,
  slug,
}: Props) {
  const searchParams = useSearchParams();
  const initialOpen = Boolean(
    searchParams.get("person") && slug && searchParams.get("person") === slug
  );
  const [isOpen, setIsOpen] = useState(initialOpen);
  const hasImage = Boolean(image?.node?.sourceUrl);

  const onOpen = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="PersonGrid-thumb Tile column js-personThumb">
      {hasImage && image?.node && (
        <div className="LazyLoad js-linkToPerson">
          <MediaImage
            {...image.node}
            className="LazyLoad-image u-bounceUp"
            loading="lazy"
            fetchPriority="low"
          />
        </div>
      )}

      {name && <h3 className="Tile-title">{name}</h3>}
      {position && <h4 className="Tile-subTitle">{position}</h4>}

      {details && (
        <div className="Tile-content">
          <button
            type="button"
            className="Tile-readMore"
            onClick={onOpen}
            aria-expanded={isOpen}
            role="button"
          >
            Read more
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="Modal is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memberCardTitle"
        >
          <div className="Modal-overlay" onClick={onClose} />
          <div className="Modal-content">
            <button type="button" className="Modal-close" aria-label="Close" onClick={onClose}>
              <svg className="Icon Icon-cross">
                <use xlinkHref="#icon-cross" />
              </svg>
            </button>

            <div className="row">
              {hasImage && image?.node && (
                <div className="column small-14 medium-7 large-6">
                  <MediaImage
                    {...image.node}
                    className="LazyLoad-image u-bounceUp"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              )}
              <div className="column small-14 medium-7 large-8">
                {name && <h3 className="Tile-title">{name}</h3>}
                {position && <h4 className="Tile-subTitle">{position}</h4>}
                {(email || phone || linkedinUrl) && (
                  <dl className="Tile-contact u-spaceAfterSmall">
                    {email && (
                      <div>
                        <dt>Email</dt>
                        <dd>
                          <a href={`mailto:${email}`}>{email}</a>
                        </dd>
                      </div>
                    )}
                    {phone && (
                      <div>
                        <dt>Phone</dt>
                        <dd>
                          <a href={`tel:${phone}`}>{phone}</a>
                        </dd>
                      </div>
                    )}
                    {linkedinUrl && (
                      <div>
                        <dt>LinkedIn</dt>
                        <dd>
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                            {linkedinUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
                <div
                  className="rte Tile-readMoreContent js-tileReadMoreContent"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(details ?? "") }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
