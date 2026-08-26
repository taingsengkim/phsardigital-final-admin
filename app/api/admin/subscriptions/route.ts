import { NextRequest, NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "")

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const authHeaders = await getAuthHeader(request)
    const { searchParams } = new URL(request.url)

    const response = await fetch(`${BASE_URL}/admin/subscriptions?${searchParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json", ...authHeaders },
      cache: "no-store",
    })

    const body = await response.text()

    return new Response(body || null, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seller subscriptions service unavailable."
    return NextResponse.json({ message }, { status: 502 })
  }
}
