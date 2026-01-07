export const replaceDomain = (url: string): string => {
  const oldDomain = process.env.API_DOMAIN;
  const newDomain = process.env.FRONTEND_DOMAIN;
  return url.replace(
    new RegExp(`(https?:\/\/)${oldDomain}(?![^"]*wp-content)`, "g"),
    `$1${newDomain}`
  );
};

export const normalizeAppHref = (
  url?: string | null
): { href: string | null; isInternal: boolean } => {
  if (!url) return { href: null, isInternal: false };
  const replaced = replaceDomain(url);
  try {
    const u = new URL(replaced);
    const front = process.env.FRONTEND_DOMAIN;
    if (front && u.host === front) {
      return { href: `${u.pathname}${u.search}${u.hash}`, isInternal: true };
    }
  } catch {}
  const isInternal = replaced.startsWith("/") && !replaced.startsWith("//");
  return { href: replaced, isInternal };
};
