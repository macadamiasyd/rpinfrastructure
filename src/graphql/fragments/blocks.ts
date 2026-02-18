export const BlockFragment = `
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
    ... on AcfVideo {
      ...VideoBlockFragment
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
`;
