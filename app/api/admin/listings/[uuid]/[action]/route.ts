import { NextRequest, NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "")

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; action: string }> }
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { uuid, action } = await params

    if (!["suspend", "restore"].includes(action)) {
      return NextResponse.json({ message: "Invalid moderation action" }, { status: 400 })
    }

    const authHeaders = await getAuthHeader(request)
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...authHeaders,
    }

    let bodyText: string | undefined
    if (action === "suspend") {
      headers["Content-Type"] = "application/json"
      bodyText = await request.text().catch(() => "")
    }

    const response = await fetch(
      `${BASE_URL}/admin/listings/${encodeURIComponent(uuid)}/${action}`,
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
    const message = error instanceof Error ? error.message : "Listing moderation action failed."
    return NextResponse.json({ message }, { status: 502 })
  }
}
