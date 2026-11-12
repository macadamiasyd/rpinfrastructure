/**
 * Build a frontend image-optimizer URL for a remote source.
 *
 * `next/image` covers everything rendered as an element; this is for the cases
 * that can't be — a CSS `background-image`, chiefly — so those stop fetching
 * full-size originals straight from the WordPress origin.
 *
 * `width` must be one of the configured `deviceSizes`/`imageSizes` and
 * `quality` one of `images.qualities`, otherwise the optimizer rejects the
 * request outright. 2048 and 85 are both in the current config.
 */
export function optimizedImageUrl(src: string, width = 2048, quality = 85): string {
  if (!src) return "";

  // The optimizer refuses vectors (without dangerouslyAllowSVG) and data URIs,
  // so they're handed back untouched rather than turned into a 400.
  if (/^data:/i.test(src) || /\.svgz?(?:[?#]|$)/i.test(src)) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
