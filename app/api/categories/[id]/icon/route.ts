import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(`${BASE_URL}/categories/${encodeURIComponent(id)}/icon`, {
      method: "DELETE",
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
      return NextResponse.json(
        { message: "Failed to remove category icon" },
        { status: upstreamRes.status },
      );
    }

    return NextResponse.json(data ?? { success: true }, { status: upstreamRes.status });
  } catch (err: unknown) {
    console.error("DELETE Category icon error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}
