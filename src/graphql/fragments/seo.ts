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

/**
 * Same shape, different root type. Yoast exposes SEO on terms as TaxonomySEO,
 * which is not a PostTypeSEO — spreading SeoFragment on a term is a hard
 * GraphQL error, not a null field.
 */
export const TaxonomySeoFragment = gql`
  fragment TaxonomySeoFragment on TaxonomySEO {
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
