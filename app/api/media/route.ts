import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      cache: "force-cache",
    });

    if (!upstreamRes.ok) {
      return new NextResponse(`Failed to fetch media from source (HTTP ${upstreamRes.status})`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    console.error("Media proxy error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Media proxy service unavailable.",
      { status: 502 },
    );
  }
}
