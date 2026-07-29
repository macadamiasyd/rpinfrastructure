import Link from "next/link";
import type { Menu, MenuItem, ThemeOptions } from "@/graphql/generated/graphql";
import type { FooterLocation } from "@/lib/utilities/footerLocations";
import { flatMenuToHierarchical } from "@/lib/utilities/flatMenuToHierarchiacal";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";
import clsx from "clsx";

import MediaImage from "@/components/shared/media/image";

interface ModifiedMenuItem extends MenuItem {
  children?: MenuItem[];
}

type Props = {
  options: ThemeOptions & { locations?: FooterLocation[] };
  menu?: Menu;
};

function slugifyCity(city: string) {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function FooterClient({ options, menu }: Props) {
  const menuNodes = menu?.menuItems?.nodes ?? [];
  const items: ModifiedMenuItem[] = menuNodes.length ? flatMenuToHierarchical([...menuNodes]) : [];

  const currentYear = new Date().getFullYear();

  const {
    linkedinLink,
    followUsText = "Follow us",
    abnNo,
    copyrightSection,
    locations,
    showSignupInFooter = false,
  } = options;

  return (
    <footer className="Footer" role="contentinfo">
      <div className="Footer-container row">
        {linkedinLink && (
          <>
            <div
              className="Footer-addresses columns large-11 xlarge-8 u-insetWrap"
              data-equalizer="true"
              data-equalizer-mq="large"
            >
              <div className="cus_social">
                <p className="follow_txt">{followUsText}</p>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow us on LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 50 50"
                    style={{ fill: "#fff" }}
                  >
                    <path d="M25,2C12.318,2,2,12.317,2,25s10.318,23,23,23s23-10.317,23-23S37.682,2,25,2z M18,35h-4V20h4V35z M16,17 c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2C18,16.105,17.105,17,16,17z M37,35h-4v-5v-2.5c0-1.925-1.575-3.5-3.5-3.5 S26,25.575,26,27.5V35h-4V20h4v1.816C27.168,20.694,28.752,20,30.5,20c3.59,0,6.5,2.91,6.5,6.5V35z" />
                  </svg>
                </a>
              </div>
            </div>
            <hr />
          </>
        )}

        <div
          className="Footer-addresses columns large-11 xlarge-8 u-insetWrap"
          data-equalizer="true"
          data-equalizer-mq="large"
        >
          <div className="row large-up-2">
            <div className="column" data-equalizer-watch>
              <ul className="FooterMenu">
                {locations?.filter(Boolean).map((loc, i) => (
                  <li key={loc?.city ?? i} className="FooterMenu-item">
                    {loc?.city && (
                      <Link href={`/contact/#${slugifyCity(loc.city)}`}>{loc.city}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="column" data-equalizer-watch>
              <ul className="FooterMenu">
                {items.map((item) => {
                  const liClasses = clsx(
                    "FooterMenu-item",
                    item.cssClasses?.map((c) => c?.replace(/Menu/g, "FooterMenu")),
                    item.children && item.children.length > 0 && "menu-item-has-children"
                  );
                  return (
                    <li key={item.id} className={liClasses}>
                      <Link href={item.uri ?? ""} target={item.target ?? "_self"}>
                        {item.label}
                      </Link>
                      {item.children &&
                        item.children.length > 0 &&
                        item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.uri ?? ""}
                            target={child.target ?? "_self"}
                            className={clsx(
                              child.cssClasses?.map((c) => c?.replace(/Menu/g, "FooterMenu"))
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <hr />

        <div
          className="Footer-addresses columns large-11 xlarge-8 u-insetWrap"
          data-equalizer="true"
          data-equalizer-mq="large"
        >
          <div className="footer_sec_total">
            <div className="footer_sec_logo">
              {options.footerLogo && <MediaImage {...options.footerLogo.node} />}
            </div>
            <div className="footer_copyright_sec">
              <p>
                &copy; RP Infrastructure {currentYear}&nbsp;&nbsp;&nbsp;
                {abnNo && <span className="cus_abnno">{abnNo}</span>}
              </p>
              {copyrightSection && (
                <ul
                  className="copyright_sec SocialMenu"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(copyrightSection) }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showSignupInFooter && (
        <div className="Footer-subscribeForm columns large-3">
          <h5 className="Footer-header Footer-header--dark">Sign up for newsletters</h5>
        </div>
      )}
      <a href="#page-top" className="u-skipLink">
        Back to top
      </a>
    </footer>
  );
}
