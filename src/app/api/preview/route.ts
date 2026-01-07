import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPreviewData } from "@/lib/utilities/getPreviewData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const requiredParams = ["secret_token", "post_id"];
  const params: Record<string, string> = {};

  for (const key of requiredParams) {
    const value = searchParams.get(key);
    if (!value) {
      return new Response(`Missing parameter: ${key}`, { status: 400 });
    }
    params[key] = value;
  }

  const { secret_token, post_id } = params;
  const previewSecret = process.env.PREVIEW_SECRET_TOKEN;

  if (!previewSecret) {
    return new Response("Server misconfigured: missing PREVIEW_SECRET_TOKEN", {
      status: 500,
    });
  }

  if (secret_token !== previewSecret) {
    return new Response("Invalid preview token", { status: 403 });
  }

  const post = await getPreviewData(Number(post_id));
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();

  return redirect(`/preview?post_id=${post_id}&secret_token=${secret_token}`);
}
