"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Menu, ThemeOptions } from "@/graphql/generated/graphql";
import useHideOnScroll from "@/lib/hooks/useHideOnScroll";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

import MediaImage from "@/components/shared/media/image";
import Navigation from "../shared/navigation";

type Props = {
  options: ThemeOptions;
  menu?: Menu;
};

export default function HeaderClient({ options, menu }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { ref: markerRef, inView } = useInView({ threshold: 0 });
  const [navOpen, setNavOpen] = useState(false);
  const pinned = !inView;
  const hidden = useHideOnScroll({ nearTopThreshold: 20, enabled: pinned && !navOpen });

  useEffect(() => {
    const body = document.body;
    if (navOpen) {
      body.classList.add("is-navOpen");
    } else {
      body.classList.remove("is-navOpen");
    }
    return () => body.classList.remove("is-navOpen");
  }, [navOpen]);
  useEffect(() => {
    const t = setTimeout(() => setNavOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {isHome && (
        <div
          className="abc-menu style-bg"
          style={{
            backgroundImage: options.topHeaderImage?.node?.sourceUrl
              ? `url('${options.topHeaderImage.node.sourceUrl}')`
              : undefined,
          }}
        >
          <div className="max-w align-left">
            <div className="max-w-inner text-left">
              {options.topHeaderImage1?.node && (
                <div className="logo">
                  <MediaImage {...options.topHeaderImage1.node} />
                </div>
              )}
              {options.topHeaderStamp?.node && (
                <div className="stamp">
                  <MediaImage {...options.topHeaderStamp.node} />
                </div>
              )}
              {options.topHeaderHeading && <h1>{options.topHeaderHeading}</h1>}
              {Array.isArray(options.topHeaderList) && options.topHeaderList.length > 0 && (
                <ul className="list-info">
                  {options.topHeaderList.map((item, idx) => (
                    <li key={`preheader-list-${idx}`}>{item?.text}</li>
                  ))}
                </ul>
              )}
              {options.topHeaderSubtitle && (
                <strong className="subtitle">{options.topHeaderSubtitle}</strong>
              )}
              {options.topHeaderImage2?.node && (
                <div className="add-logo">
                  <MediaImage {...options.topHeaderImage2.node} />
                </div>
              )}
              {options.topHeaderButtonLink && (
                <a
                  className="u-linkForward PullQuote-readMore cus_rdmore"
                  href={options.topHeaderButtonLink}
                >
                  <span>{options.topHeaderButtonLabel} &gt;</span>
                  <svg className="Icon Icon-arrow-right">
                    <use xlinkHref="#icon-arrow-right" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <span className="Header-marker" ref={markerRef} />
      <header className={clsx("Header", { "Header--hidden": hidden })}>
        <div className="Header-masthead row">
          <h1 className="Header-logo">
            <Link href="/">
              {options.logo?.node && <MediaImage {...options.logo.node} />}
              <span className="show-for-sr">{options.logo?.node?.altText ?? "Home"}</span>
            </Link>
          </h1>
          <button
            className="NavToggle js-navToggle"
            type="button"
            data-toggle="collapse"
            data-target="nav"
            aria-controls="navMain"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((prevState) => !prevState)}
          >
            <span className="NavToggle-label">Menu</span>
            <svg className=" NavToggle-close Icon Icon--cross">
              <use xlinkHref="#icon-cross" />
            </svg>
          </button>
          {menu && <Navigation {...menu} extraClasses={["Header-nav"]} id="navMain" />}
        </div>
      </header>
    </>
  );
}
