import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { search } = new URL(request.url);
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(`${BASE_URL}/categories${search}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders,
      },
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
      return NextResponse.json({ message: "Failed to fetch categories" }, { status: upstreamRes.status });
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("GET Categories error:", err);
    return NextResponse.json(
      { message: err?.message || "Service unavailable." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const payload = await request.json();
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
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
      return NextResponse.json({ message: "Failed to create category" }, { status: upstreamRes.status });
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("POST Category error:", err);
    return NextResponse.json(
      { message: err?.message || "Service unavailable." },
      { status: 502 },
    );
  }
}
