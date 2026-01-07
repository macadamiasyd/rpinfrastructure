import { gql } from "@apollo/client";

export const BannerTextBlockFragment = gql`
  fragment BannerTextBlockFragment on AcfBannerText {
    renderedHtml
    attributes {
      className
      data
    }
    bannerWithText {
      heading
      image {
        ...AcfImageFragment
      }
      link {
        ...LinkFragment
      }
    }
  }
`;
