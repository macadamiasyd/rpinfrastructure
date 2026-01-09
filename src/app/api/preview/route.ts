import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postIdParam = url.searchParams.get("post_id");
  const secretToken = url.searchParams.get("secret_token");
  if (!postIdParam || !secretToken) {
    return new Response("Missing parameters", { status: 400 });
  }
  if (!process.env.PREVIEW_SECRET_TOKEN || secretToken !== process.env.PREVIEW_SECRET_TOKEN) {
    return new Response("Invalid secret token", { status: 401 });
  }
  const dm = await draftMode();
  dm.enable();
  const target = `/preview?post_id=${encodeURIComponent(postIdParam)}&secret_token=${encodeURIComponent(secretToken)}`;
  return redirect(target);
}
