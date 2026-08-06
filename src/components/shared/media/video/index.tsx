import type { MediaItem } from "@/graphql/generated/graphql";

export default function MediaVideo({
  // Not sourceUrl: that resolves through image sizes and is null for a video
  // attachment. mediaItemUrl is the plain file URL, correct for any mime type.
  mediaItemUrl: url,
  autoPlay = false,
  loop = false,
  muted = false,
  className,
}: MediaItem & {
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <>
      {url ? (
        <video autoPlay={autoPlay} loop={loop} muted={muted} playsInline className={className}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}
    </>
  );
}
