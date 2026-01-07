import type { PageEditorBlock } from "@/graphql/generated/graphql";

import sections from "./sections";

type PageBuilderProps = {
  blocks: PageEditorBlock[];
};

export default function PageBuilder({ blocks }: PageBuilderProps) {
  return (
    <>
      {blocks.map((block, index) => {
        if (!block.name) return null;
        const Component = sections[block.name as keyof typeof sections];
        if (!Component) return null;
        return <Component key={index} {...block} />;
      })}
    </>
  );
}
