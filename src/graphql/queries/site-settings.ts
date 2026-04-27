import { gql } from "@apollo/client";
export const SiteSettingsQuery = gql`
  query SiteSettingsQuery {
    themeSettings {
      locationsOld {
        locations {
          city
        }
      }
      themeOptions {
        abnNo
        copyrightSection
        followUsText
        footerLogo {
          ...AcfImageFragment
        }
        linkedinLink
        logo {
          ...AcfImageFragment
        }
        showSignupInFooter
        topHeaderButtonLink
        topHeaderButtonLabel
        topHeaderHeading
        topHeaderSubtitle
        topHeaderImage {
          ...AcfImageFragment
        }
        topHeaderImage1 {
          ...AcfImageFragment
        }
        topHeaderImage2 {
          ...AcfImageFragment
        }
        topHeaderStamp {
          ...AcfImageFragment
        }
        topHeaderList {
          text
        }
        pageForPerson {
          nodes {
            id
            uri
          }
        }
        pageForPortfolio {
          nodes {
            id
            uri
          }
        }
        pageForSearch {
          nodes {
            id
            uri
          }
        }
      }
    }
  }
`;
