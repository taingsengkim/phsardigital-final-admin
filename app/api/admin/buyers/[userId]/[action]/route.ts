import { NextRequest, NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "")

async function proxyBuyerAction(
  request: NextRequest,
  userId: string,
  action: string,
  method: "PATCH" = "PATCH",
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const authHeaders = await getAuthHeader(request)

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...authHeaders,
    }

    let body: string | undefined
    if (["suspend", "ban"].includes(action)) {
      const requestBody = await request.text().catch(() => null)
      if (requestBody) {
        headers["Content-Type"] = "application/json"
        body = requestBody
      }
    }

    const response = await fetch(
      `${BASE_URL}/admin/buyers/${encodeURIComponent(userId)}/${action}`,
      { method, headers, body, cache: "no-store" },
    )

    const responseBody = await response.text()

    return new Response(responseBody || null, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Buyer action failed."
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; action: string }> },
) {
  const { userId, action } = await params

  if (!["suspend", "restore", "ban"].includes(action)) {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  }

  return proxyBuyerAction(request, userId, action)
}
