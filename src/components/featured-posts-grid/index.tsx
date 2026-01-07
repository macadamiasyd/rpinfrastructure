import type { Post } from "@/graphql/generated/graphql";

import FeaturedPost from "../cards/featured-post";

type Props = {
  posts: Post[];
};
export default function FeaturedPostsGrid({ posts }: Props) {
  return (
    <div>
      {posts.map((post, index) => (
        <FeaturedPost key={post.id ?? index} {...post} />
      ))}
    </div>
  );
}
