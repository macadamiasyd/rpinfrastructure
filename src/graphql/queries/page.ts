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
import { AcfImageFramgent, BlockFragment, LinkFragment, NodeImageFragment } from "../fragments";

export const PageQuery = gql`
  query PageQuery($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      __typename
      title
      isFrontPage
      isPostsPage
      content
      template {
        templateName
      }
      seo {
        ...SeoFragment
      }
      editorBlocks(flat: false) {
        ${BlockFragment}
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
  ${OurPurposesAndValuesBlockFragment}
`;

export const PageSeoQuery = gql`
  query PageSeoQuery($slug: ID!) {
    page(id: $slug, idType: URI) {
      __typename
      id
      seo {
        ...SeoFragment
      }
    }
  }
`;

export const PagesSitemapQuery = gql`
  query PagesSitemapQuery {
    pages(first: 999, where: { status: PUBLISH }) {
      nodes {
        id
        uri
        modifiedGmt
      }
    }
  }
`;
