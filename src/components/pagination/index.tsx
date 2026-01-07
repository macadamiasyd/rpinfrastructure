import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  slug: string;
};

export default function Pagination({ totalPages, currentPage, slug }: Props) {
  if (totalPages <= 1) return null;

  const pageUrl = (page: number) => (page <= 1 ? `/${slug}` : `/${slug}/${page}`);

  const prev = currentPage > 1;
  const next = currentPage < totalPages;

  const getPageItems = (total: number, current: number, delta = 2) => {
    const pages: (number | "...")[] = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i <= right)) {
        pages.push(i);
      } else if (i === left - 1 || i === right + 1) {
        pages.push("...");
      }
    }

    return pages.filter((item, idx, arr) => {
      if (item !== "...") return true;
      return arr[idx - 1] !== "...";
    });
  };

  const items = getPageItems(totalPages, currentPage);

  return (
    <nav aria-label="Pagination" className="Pagination-nav">
      <ul className="Pagination" role="list">
        {prev && (
          <li className="Pagination-item">
            <Link
              href={pageUrl(currentPage - 1)}
              className="Pagination-prev"
              aria-label="Previous page"
            >
              Prev
            </Link>
          </li>
        )}

        {items.map((item, idx) =>
          item === "..." ? (
            <li key={`ellipsis-${idx}`} className="Pagination-ellipsis" aria-hidden>
              <span>…</span>
            </li>
          ) : (
            <li key={item} className="Pagination-item">
              <Link
                href={pageUrl(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={item === currentPage ? "is-current" : ""}
              >
                {item}
              </Link>
            </li>
          )
        )}

        {next && (
          <li className="Pagination-item">
            <Link
              href={pageUrl(currentPage + 1)}
              className="Pagination-next"
              aria-label="Next page"
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
