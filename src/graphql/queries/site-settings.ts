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
        enableJobForm
        followUsText
        footerLogo {
          ...AcfImageFragment
        }
        jobForm
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
        pageForJob {
          nodes {
            id
            uri
          }
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
