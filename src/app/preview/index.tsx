import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { getPreviewData } from "@/lib/utilities/getPreviewData";

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
  return <></>;
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
