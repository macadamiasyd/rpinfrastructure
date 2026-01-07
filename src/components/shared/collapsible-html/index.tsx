"use client";

import { useState } from "react";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

type Props = {
  html: string;
  isCollapsible?: boolean;
  extraClass?: string;
};

export default function CollapsibleHtml({ html, isCollapsible, extraClass = "" }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const cls = `rte${extraClass}`;
  if (!isCollapsible) {
    return <div className={cls} dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} />;
  }
  return (
    <div className={cls}>
      <div
        style={
          collapsed
            ? {
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
      />
      <button
        type="button"
        className="Tile-readMore"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
      >
        {collapsed ? "Read more" : "Read less"}
      </button>
    </div>
  );
}
