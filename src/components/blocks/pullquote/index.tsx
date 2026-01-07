import Link from "next/link";
import type { AcfPullQuotes } from "@/graphql/generated/graphql";
import { normalizeAppHref } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

export default function PullQuoteBlock({ pullQuotes }: AcfPullQuotes) {
  if (!pullQuotes || !pullQuotes.quotes || pullQuotes.quotes.length === 0) return null;

  const renderQuote = (q: (typeof pullQuotes.quotes)[number], index: number) => {
    if (!q || !q.quote) return null;

    const content = sanitizeHTML(q.quote);
    const { href, isInternal } = normalizeAppHref(q.link?.url ?? null);
    const linkTitle = q.link?.title || null;
    const target = q.link?.target ?? undefined;

    return (
      <div key={`pullquote-${index}`} className={`PullQuote${href ? " PullQuote-linked" : ""}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {href &&
          (isInternal ? (
            <Link href={href} className="u-linkForward PullQuote-readMore">
              <span>{linkTitle ?? "Read more"}</span>{" "}
              <svg className="Icon Icon-arrow-right">
                <use xlinkHref="#icon-arrow-right" />
              </svg>
            </Link>
          ) : (
            <a
              href={href}
              className="u-linkForward PullQuote-readMore"
              target={target}
              rel={target === "_blank" ? "noopener noreferrer" : undefined}
            >
              <span>{linkTitle ?? "Read more"}</span>{" "}
              <svg className="Icon Icon-arrow-right">
                <use xlinkHref="#icon-arrow-right" />
              </svg>
            </a>
          ))}
      </div>
    );
  };

  return (
    <article className="Home u-insetWrap">
      <div className="Home-lead">
        {pullQuotes.quotes.map((quote, index) => renderQuote(quote, index))}
      </div>
    </article>
  );
}
