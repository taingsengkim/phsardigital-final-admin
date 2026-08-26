import { NextRequest, NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "")

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string; action: string }> }
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { sellerId, action } = await params

    if (!["grant", "cancel"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    const authHeaders = await getAuthHeader(request)
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...authHeaders,
    }

    let bodyText: string | undefined
    if (action === "grant") {
      headers["Content-Type"] = "application/json"
      bodyText = await request.text().catch(() => "")
    }

    const response = await fetch(
      `${BASE_URL}/admin/subscriptions/${encodeURIComponent(sellerId)}/${action}`,
      {
        method: "PATCH",
        headers,
        body: bodyText || undefined,
        cache: "no-store",
      }
    )

    const responseBody = await response.text()

    return new Response(responseBody || null, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seller subscription action failed."
    return NextResponse.json({ message }, { status: 502 })
  }
}
