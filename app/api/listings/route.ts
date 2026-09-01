import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { search } = new URL(request.url);
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(`${BASE_URL}/listings${search}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders,
      },
      cache: "no-store",
    });

    const text = await upstreamRes.text();
    let data: unknown = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!upstreamRes.ok) {
      if (data && typeof data === "object") {
        return NextResponse.json(data, { status: upstreamRes.status });
      }
      return NextResponse.json({ message: "Failed to fetch listings" }, { status: upstreamRes.status });
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("GET Listings error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const originalPayload = await request.json();
    const authHeaders = await getAuthHeader(request);

    let payload = { ...originalPayload };
    let upstreamRes: Response | null = null;
    let data: unknown = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      upstreamRes = await fetch(`${BASE_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      const text = await upstreamRes.text();
      data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (upstreamRes.ok) {
        break;
      }

      // Check if it's a slug conflict (409 Conflict or message contains "slug already exists")
      const isSlugConflict =
        upstreamRes.status === 409 ||
        (data &&
          typeof data === "object" &&
          (String((data as any).message || "").toLowerCase().includes("slug") ||
            String((data as any).error || "").toLowerCase().includes("slug") ||
            String((data as any).detail || "").toLowerCase().includes("slug")));

      if (isSlugConflict && attempt < maxRetries) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        // Generate new slug or title with unique suffix
        if (payload.title) {
          payload.title = `${originalPayload.title}-${randomSuffix}`;
        }
        if (payload.slug) {
          payload.slug = `${originalPayload.slug}-${randomSuffix}`;
        }
        continue;
      }

      break;
    }

    if (!upstreamRes || !upstreamRes.ok) {
      if (data && typeof data === "object") {
        return NextResponse.json(data, { status: upstreamRes?.status ?? 500 });
      }
      return NextResponse.json(
        { message: "Failed to create listing" },
        { status: upstreamRes?.status ?? 500 },
      );
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("POST Listing error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}

