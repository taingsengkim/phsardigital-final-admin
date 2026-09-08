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

    let contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    if (!contentType || contentType === "application/octet-stream") {
      const cleanUrl = targetUrl.split("?")[0].toLowerCase();
      if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (cleanUrl.endsWith(".png")) contentType = "image/png";
      else if (cleanUrl.endsWith(".webp")) contentType = "image/webp";
      else if (cleanUrl.endsWith(".gif")) contentType = "image/gif";
      else if (cleanUrl.endsWith(".pdf")) contentType = "application/pdf";
      else if (cleanUrl.endsWith(".svg")) contentType = "image/svg+xml";
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
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
