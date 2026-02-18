import styles from "./index.module.scss";
import type { AcfVideo } from "@/graphql/generated/graphql";
import clsx from "clsx";

export default function VideoBlock({ videoBlock }: AcfVideo) {
  if (!videoBlock) return null;
  const { url } = videoBlock;
  if (!url) return null;
  return (
    <section className={clsx(styles["video-block"], "u-spaceBeforeLarge", "u-spaceAfterLarge")}>
      <div className="row">
        <div className="columns">
          <iframe
            width="100%"
            height="315"
            src={url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
