import { gql } from "@apollo/client";

import {
  BackgroundVideoBlockFragment,
  BannerImageBlockFragment,
  BannerTextBlockFragment,
  CarouselBlockFragment,
  ExpertiseOptionsBlockFragment,
  HomeFeedBlockFragment,
  HomePageOptionsBlockFragment,
  LocationsBlockFragment,
  OurPurposesAndValuesBlockFragment,
  PortfolioOptionsBlockFragment,
  PostsLoopBlockFragment,
  PullQuotesBlockFragment,
  SocialInfrastructureOptionsBlockFragment,
  StorySectionBlockFragment,
  TemplateOptionsBlockFragment,
} from "../block-fragments";
import { AcfImageFramgent, LinkFragment, NodeImageFragment, SeoFragment } from "../fragments";

export const PreviewQuery = gql`
  query PreviewQuery($id: ID!) {
    contentNode(id: $id, idType: DATABASE_ID) {
      id
      contentTypeName
      seo {
        ...SeoFragment
      }
      ... on Page {
        title
        content
        isFrontPage
        isPostsPage
        template {
          templateName
        }
        editorBlocks(flat: false) {
          name
          id: clientId
          renderedHtml
          ... on AcfBackgroundVideo {
            ...BackgroundVideoBlockFragment
          }
          ... on AcfBannerImage {
            ...BannerImageBlockFragment
          }
          ... on AcfBannerText {
            ...BannerTextBlockFragment
          }
          ... on AcfCarousel {
            ...CarouselBlockFragment
          }
          ... on AcfHomePageOptions {
            ...HomePageOptionsBlockFragment
          }
          ... on AcfPullQuotes {
            ...PullQuotesBlockFragment
          }
          ... on AcfHomeFeed {
            ...HomeFeedBlockFragment
          }
          ... on AcfPostsLoop {
            ...PostsLoopBlockFragment
          }
          ... on AcfLocations {
            ...LocationsBlockFragment
          }
          ... on AcfTemplateOptions {
            ...TemplateOptionsBlockFragment
          }
          ... on AcfExpertiseOptions {
            ...ExpertiseOptionsBlockFragment
          }
          ... on AcfSocialInfrastructureOptions {
            ...SocialInfrastructureOptionsBlockFragment
          }
          ... on AcfPortfolioOptions {
            ...PortfolioOptionsBlockFragment
          }
          ... on AcfStorySection {
            ...StorySectionBlockFragment
          }
          ... on AcfOurPurposeAndValues {
            ...OurPurposesAndValuesBlockFragment
          }
        }
      }
      ... on Post {
        title
        content
        slug
        featuredImage {
          ...NodeImageFragment
        }
        carousel {
          slides {
            image {
              ...AcfImageFragment
            }
          }
        }
      }
      ... on Project {
        title
        content
        slug
        databaseId
        featuredImage {
          ...NodeImageFragment
        }
        carousel {
          slides {
            image {
              ...AcfImageFragment
            }
          }
        }
        projectCategories(first: 50) {
          nodes {
            __typename
            name
            slug
            uri
            link
          }
        }
        projectServices(first: 50) {
          nodes {
            __typename
            name
            slug
            uri
            link
          }
        }
        projectLocations(first: 50) {
          nodes {
            __typename
            name
            slug
            uri
            link
          }
        }
      }
    }
  }
  ${BackgroundVideoBlockFragment}
  ${BannerImageBlockFragment}
  ${BannerTextBlockFragment}
  ${CarouselBlockFragment}
  ${StorySectionBlockFragment}
  ${HomePageOptionsBlockFragment}
  ${PullQuotesBlockFragment}
  ${HomeFeedBlockFragment}
  ${PostsLoopBlockFragment}
  ${LocationsBlockFragment}
  ${TemplateOptionsBlockFragment}
  ${ExpertiseOptionsBlockFragment}
  ${SocialInfrastructureOptionsBlockFragment}
  ${PortfolioOptionsBlockFragment}
  ${NodeImageFragment}
  ${AcfImageFramgent}
  ${LinkFragment}
  ${SeoFragment}
  ${OurPurposesAndValuesBlockFragment}
`;
