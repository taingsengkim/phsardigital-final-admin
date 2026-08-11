import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/auth";

const BASE_URL = process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authHeaders = await getAuthHeader(request);

    const upstreamRes = await fetch(`${BASE_URL}/files/upload`, {
      method: "POST",
      headers: {
        ...authHeaders,
      },
      body: formData,
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
      return NextResponse.json({ message: "Failed to upload file" }, { status: upstreamRes.status });
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("POST File Upload error:", err);
    return NextResponse.json(
      { message: err?.message || "Service unavailable." },
      { status: 502 },
    );
  }
}
