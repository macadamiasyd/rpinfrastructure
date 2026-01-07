import { gql } from "@apollo/client";

export const ImageFramgent = gql`
  fragment ImageFragment on MediaItem {
    altText
    mediaDetails {
      height
      width
    }
    guid
    caption
  }
`;

export const NodeImageFragment = gql`
  fragment NodeImageFragment on NodeWithFeaturedImageToMediaItemConnectionEdge {
    node {
      altText
      mediaDetails {
        height
        width
      }
      guid
      caption
      sourceUrl
      srcSet
      sizes
    }
  }
`;

export const AcfImageFramgent = gql`
  fragment AcfImageFragment on AcfMediaItemConnectionEdge {
    node {
      altText
      mediaDetails {
        height
        width
      }
      guid
      caption
    }
  }
`;
