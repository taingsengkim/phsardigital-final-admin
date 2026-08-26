import { NextRequest, NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "")

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string; action: string }> }
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { code, action } = await params

    if (!["activate", "deactivate"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    const authHeaders = await getAuthHeader(request)

    const response = await fetch(
      `${BASE_URL}/admin/subscription-plans/${encodeURIComponent(code)}/${action}`,
      {
        method: "PATCH",
        headers: { Accept: "application/json", ...authHeaders },
        cache: "no-store",
      }
    )

    const body = await response.text()

    return new Response(body || null, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Plan toggle action failed."
    return NextResponse.json({ message }, { status: 502 })
  }
}
