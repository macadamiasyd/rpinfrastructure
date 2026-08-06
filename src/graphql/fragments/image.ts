import { gql } from "@apollo/client";

/**
 * Image URLs come from `sourceUrl`, never `guid`.
 *
 * A guid is WordPress's permanent identifier for a post. For attachments it
 * happens to look like a URL, but it is frozen at upload time and is not
 * rewritten when the site moves. At the 2026-08 cutover to
 * admin.rpinfrastructure.com.au every guid still pointed at the old staging
 * host, so pages rendered a mix of two domains until 1,385 attachment guids
 * were rewritten by hand. `sourceUrl` is derived from the uploads directory at
 * request time and follows the site wherever it goes.
 */
export const ImageFramgent = gql`
  fragment ImageFragment on MediaItem {
    altText
    mediaDetails {
      height
      width
    }
    sourceUrl
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
      caption
      sourceUrl(size: LARGE)
      srcSet
      sizes
    }
  }
`;

/**
 * Also carries `mediaItemUrl`, because this fragment is reused for video fields
 * (the background-video block's videoFile / videoFileMobile). `sourceUrl`
 * resolves through image sizes and comes back **null** for a video attachment;
 * `mediaItemUrl` is the plain file URL and is correct for every mime type.
 */
export const AcfImageFramgent = gql`
  fragment AcfImageFragment on AcfMediaItemConnectionEdge {
    node {
      altText
      mediaDetails {
        height
        width
      }
      sourceUrl
      mediaItemUrl
      mimeType
      caption
    }
  }
`;
