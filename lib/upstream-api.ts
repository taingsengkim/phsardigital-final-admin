import { NextResponse } from "next/server"

import { getAuthHeader } from "@/lib/auth"

const upstreamApiUrl = (process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1").replace(/\/$/, "")

export async function proxyUpstreamRequest(
  request: Request,
  path: string,
  method: "GET" | "PATCH",
) {
  try {
    const authHeaders = await getAuthHeader(request)
    const upstreamResponse = await fetch(`${upstreamApiUrl}${path}`, {
      method,
      headers: { Accept: "application/json", ...authHeaders },
      cache: "no-store",
    })
    const body = await upstreamResponse.text()

    return new Response(body || null, {
      status: upstreamResponse.status,
      headers: {
        "content-type": upstreamResponse.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seller application service unavailable."
    return NextResponse.json({ message }, { status: 502 })
  }
}
