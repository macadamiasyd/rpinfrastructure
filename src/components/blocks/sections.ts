import BackgroundVideoBlock from "./background-video";
import BannerImageBlock from "./banner-image";
import BannerTextBlock from "./banner-text";
import CarouselBlock from "./carousel";
import ExpertiseOptionsBlock from "./expertise-options";
import HomeFeedBlock from "./home-feed";
import HomePageOptionsBlock from "./home-page-options";
import LocationsBlock from "./locations";
import OurPurposesAndValuesBlock from "./our-purposes-and-values";
import PortfolioOptionsBlock from "./portfolio-options";
import PostsLoopBlock from "./posts-loop";
import PullQuoteBlock from "./pullquote";
import SocialInfrastructureOptionsBlock from "./social-infrastructure-options";
import StorySectionBlock from "./story-section";
import TemplateOptionsBlock from "./template-options";
import VideoBlock from "./video";

export const sections = {
  ["acf/background-video"]: BackgroundVideoBlock,
  ["acf/banner-image"]: BannerImageBlock,
  ["acf/banner-text"]: BannerTextBlock,
  ["acf/carousel"]: CarouselBlock,
  ["acf/home-page-options"]: HomePageOptionsBlock,
  ["acf/pull-quotes"]: PullQuoteBlock,
  ["acf/home-feed"]: HomeFeedBlock,
  ["acf/posts-loop"]: PostsLoopBlock,
  ["acf/locations"]: LocationsBlock,
  ["acf/template-options"]: TemplateOptionsBlock,
  ["acf/expertise-options"]: ExpertiseOptionsBlock,
  ["acf/portfolio-options"]: PortfolioOptionsBlock,
  ["acf/social-infrastructure-options"]: SocialInfrastructureOptionsBlock,
  ["acf/story-section"]: StorySectionBlock,
  ["acf/our-purpose-and-values"]: OurPurposesAndValuesBlock,
  ["acf/video"]: VideoBlock,
} as const;
export type SectionKey = keyof typeof sections;
export type Section = (typeof sections)[SectionKey];

export default sections;
