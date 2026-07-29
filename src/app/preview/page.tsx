import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { PageEditorBlock, Post, Project } from "@/graphql/generated/graphql";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { getPreviewData } from "@/lib/utilities/getPreviewData";
import { normalizeContentHtml, replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PageBuilder from "@/components/blocks/render-blocks";
import PageClassNames from "@/components/page/page-classnames.client";
import ExitPreview from "@/components/exit-preview";
import PostView from "@/components/post-view";
import ProjectView from "@/components/project-view";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function Preview({ searchParams }: Props) {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return notFound();
  }

  const { post_id, secret_token } = await searchParams;

  if (!post_id || !secret_token || secret_token !== process.env.PREVIEW_SECRET_TOKEN) {
    return notFound();
  }

  const previewData = await getPreviewData(Number(post_id));

  if (!previewData) {
    return notFound();
  }
  const type = previewData.contentTypeName;
  const isPage = type === "page";
  const isPost = type === "post";
  const isProject = type === "project";
  const isFrontPage = isPage && "isFrontPage" in previewData && !!previewData.isFrontPage;
  const templateName =
    isPage && "template" in previewData ? (previewData.template?.templateName ?? null) : null;
  const blocks =
    isPage && "editorBlocks" in previewData
      ? ((previewData.editorBlocks ?? []) as PageEditorBlock[])
      : [];
  const contentHtml = ("content" in previewData ? (previewData.content ?? "") : "") as string;
  const contentSanitized = sanitizeHTML(normalizeContentHtml(contentHtml));

  if (isPost) {
    const post = previewData as unknown as Post;
    return (
      <>
      <ExitPreview />
      <div className="AppContent row" role="main">
        {previewData?.seo?.schema?.raw && (
          <Script
            id="schema-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: replaceDomain(previewData.seo.schema.raw),
            }}
          />
        )}
        <PostView post={post} backHref="/news" />
      </div>
      </>
    );
  }

  if (isProject) {
    const project = previewData as unknown as Project;
    return (
      <>
      <ExitPreview />
      <div className="AppContent row" role="main">
        {previewData?.seo?.schema?.raw && (
          <Script
            id="schema-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: replaceDomain(previewData.seo.schema.raw) }}
          />
        )}
        <ProjectView project={project} backHref="/portfolio" />
      </div>
      </>
    );
  }

  return (
    <>
      <ExitPreview />
      {previewData?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: replaceDomain(previewData.seo.schema.raw) }}
        />
      )}
      {isPage && (
        <PageClassNames slugParts={[]} templateName={templateName} isFrontPage={isFrontPage} />
      )}
      <div role="main" className={`AppContent ${isFrontPage ? "row" : ""}`}>
        {!!contentHtml && (
          <div className="row">
            <div className="columns">
              <div
                dangerouslySetInnerHTML={{
                  __html: contentSanitized,
                }}
              />
            </div>
          </div>
        )}
        {isPage && blocks.length > 0 && <PageBuilder blocks={blocks} />}
      </div>
    </>
  );
}

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
  const { isEnabled } = await draftMode();
  const { post_id, secret_token } = await searchParams;

  if (
    !isEnabled ||
    !post_id ||
    !secret_token ||
    secret_token !== process.env.PREVIEW_SECRET_TOKEN
  ) {
    return {
      title: "Not Found",
    };
  }
  const previewData = await getPreviewData(Number(post_id));
  if (!previewData) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: previewData.seo?.title,
    ...generatePageMetadata(previewData.seo),
  };
};
