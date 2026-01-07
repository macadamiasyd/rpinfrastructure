import { gql } from "@apollo/client";

export const SeoFragment = gql`
  fragment SeoFragment on PostTypeSEO {
    title
    metaDesc
    twitterTitle
    twitterDescription
    twitterImage {
      ...ImageFragment
    }
    opengraphType
    opengraphTitle
    opengraphDescription
    opengraphUrl
    opengraphSiteName
    opengraphImage {
      ...ImageFragment
    }
    opengraphModifiedTime
    metaRobotsNoindex
    metaRobotsNofollow
    schema {
      raw
    }
  }
`;
