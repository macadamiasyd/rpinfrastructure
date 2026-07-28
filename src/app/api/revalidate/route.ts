import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-revalidate-secret");
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { names } = body;
    if (!names) {
      return new Response(JSON.stringify({ message: "Names is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(names)) {
      return new Response(JSON.stringify({ message: "Names must be an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (names.length === 0) {
      return new Response(JSON.stringify({ message: "Names must not be empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const name of names) {
      revalidateTag(name);
    }

    return new Response(
      JSON.stringify({
        message: `Successfully revalidated for: "${names.join(", ")}"`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to revalidate", error: error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
