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
import { getBasicAuthToken } from "../utilities/getBasicAuthToken";

if (!process.env.API_URL || process.env.API_URL.trim() === "") {
  throw new Error("API_URL is missing or empty. Please set it in .env.");
}

const httpLink = new HttpLink({
  uri: process.env.API_URL,
});

const authLink = new SetContextLink((prevContext) => {
  const requestHeaders = {
    ...prevContext.headers,
  };
  const token = getBasicAuthToken();

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
