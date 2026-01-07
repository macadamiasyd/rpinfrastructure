import Link from "next/link";
import type { AcfBackgroundVideo } from "@/graphql/generated/graphql";

import MediaVideo from "@/components/shared/media/video";

export default function BackgroundVideoBlock({ backgroundVideo }: AcfBackgroundVideo) {
  if (!backgroundVideo) return null;
  const { videoFile, videoFileMobile, title, link, subtitle } = backgroundVideo;
  return (
    <section className="video-section">
      {videoFile && <MediaVideo {...videoFile.node} autoPlay loop muted className="video-bg" />}
      {videoFileMobile && (
        <MediaVideo
          {...videoFileMobile.node}
          autoPlay
          loop
          muted
          className="video-bg mobile-video"
        />
      )}
      <div className="row">
        <div className="column">
          <div className="content">
            {subtitle && <p className="video-subtitle">{subtitle}</p>}
            {title && <h2>{title}</h2>}
            {link && link.url && (
              <Link href={link.url} className="cta" target={link.target ? link.target : "_self"}>
                {link.title}
                <svg className="icon-arrow-right">
                  <use xlinkHref="#icon-arrow-right" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
