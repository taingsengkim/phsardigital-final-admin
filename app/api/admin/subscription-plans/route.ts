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

    const response = await fetch(`${BASE_URL}/admin/subscription-plans`, {
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
    const message = error instanceof Error ? error.message : "Subscription plans service unavailable."
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const authHeaders = await getAuthHeader(request)
    const bodyText = await request.text()

    const response = await fetch(`${BASE_URL}/admin/subscription-plans`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: bodyText,
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
    const message = error instanceof Error ? error.message : "Failed to create subscription plan."
    return NextResponse.json({ message }, { status: 502 })
  }
}
