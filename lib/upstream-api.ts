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
    const requestContentType = request.headers.get("content-type")
    const requestBody = ["POST", "PATCH", "PUT"].includes(method)
      ? await request.text().catch(() => null)
      : null

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...authHeaders,
    }
    if (requestContentType) {
      headers["Content-Type"] = requestContentType
    } else if (requestBody) {
      headers["Content-Type"] = "application/json"
    }

    const upstreamResponse = await fetch(`${upstreamApiUrl}${path}`, {
      method,
      headers,
      body: requestBody || undefined,
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
