import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const { search } = new URL(request.url);
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(
      `${BASE_URL}/categories/${encodeURIComponent(id)}/attributes${search}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...authHeaders,
        },
        cache: "no-store",
      },
    );

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
      return NextResponse.json(
        { message: "Failed to fetch category attributes" },
        { status: upstreamRes.status },
      );
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("GET Category Attributes error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const payload = await request.json();
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(
      `${BASE_URL}/categories/${encodeURIComponent(id)}/attributes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      },
    );

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
      return NextResponse.json(
        { message: "Failed to create category attributes" },
        { status: upstreamRes.status },
      );
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("POST Category Attributes error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}
