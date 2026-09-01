import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attributeUuid: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id, attributeUuid } = await params;
    const payload = await request.json();
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(
      `${BASE_URL}/categories/${encodeURIComponent(id)}/attributes/${encodeURIComponent(attributeUuid)}`,
      {
        method: "PATCH",
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
        { message: "Failed to update category attribute" },
        { status: upstreamRes.status },
      );
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("PATCH Category Attribute error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attributeUuid: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id, attributeUuid } = await params;
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(
      `${BASE_URL}/categories/${encodeURIComponent(id)}/attributes/${encodeURIComponent(attributeUuid)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...authHeaders,
        },
      },
    );

    if (upstreamRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

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
        { message: "Failed to delete category attribute" },
        { status: upstreamRes.status },
      );
    }

    return NextResponse.json(data ?? { success: true }, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("DELETE Category Attribute error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}
