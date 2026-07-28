import {
  BackgroundVideoBlockFragment,
  BannerImageBlockFragment,
  BannerTextBlockFragment,
  CarouselBlockFragment,
  ExpertiseOptionsBlockFragment,
  HomePageOptionsBlockFragment,
  LocationsBlockFragment,
  PortfolioOptionsBlockFragment,
  PostsLoopBlockFragment,
  PullQuotesBlockFragment,
  SocialInfrastructureOptionsBlockFragment,
  StorySectionBlockFragment,
  TemplateOptionsBlockFragment,
  VideoBlockFragment,
} from "@/graphql/block-fragments";
import { gql, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { createFragmentRegistry } from "@apollo/client/cache";
import { SetContextLink } from "@apollo/client/link/context";

import {
  AcfImageFramgent,
  ImageFramgent,
  LinkFragment,
  MenuFragment,
  NodeImageFragment,
  SeoFragment,
} from "../../graphql/fragments";
import { getBasicAuthToken, getDraftAuthToken } from "../utilities/getBasicAuthToken";

if (!process.env.API_URL || process.env.API_URL.trim() === "") {
  throw new Error("API_URL is missing or empty. Please set it in .env.");
}

const httpLink = new HttpLink({
  uri: process.env.API_URL,
});

// Pass `useDraftAuth: true` in the query context to get draft/unpublished content
// (used only by getPreviewData). Regular page queries must NOT set this flag —
// it bypasses Next.js fetch caching and prevents ISR from working.
const authLink = new SetContextLink(async (prevContext) => {
  const requestHeaders = {
    ...prevContext.headers,
  };
  const token = prevContext.useDraftAuth
    ? (getDraftAuthToken() ?? getBasicAuthToken())
    : getBasicAuthToken();

  if (token) {
    requestHeaders.authorization = token;
  }
  return {
    headers: {
      ...requestHeaders,
    },
  };
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      fragments: createFragmentRegistry(gql`
        ${ImageFramgent}
        ${NodeImageFragment}
        ${AcfImageFramgent}
        ${SeoFragment}
        ${LinkFragment}
        ${BackgroundVideoBlockFragment}
        ${VideoBlockFragment}
        ${BannerImageBlockFragment}
        ${BannerTextBlockFragment}
        ${CarouselBlockFragment}
        ${LocationsBlockFragment}
        ${PostsLoopBlockFragment}
        ${StorySectionBlockFragment}
        ${TemplateOptionsBlockFragment}
        ${ExpertiseOptionsBlockFragment}
        ${SocialInfrastructureOptionsBlockFragment}
        ${PortfolioOptionsBlockFragment}
        ${HomePageOptionsBlockFragment}
        ${PullQuotesBlockFragment}
        ${MenuFragment}
      `),
    }),
    link: authLink.concat(httpLink),
  });
});
