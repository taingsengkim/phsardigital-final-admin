import { NextRequest, NextResponse } from "next/server"
import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; action: string }> }
) {
  const { uuid, action } = await params

  if (!["resolve", "dismiss"].includes(action)) {
    return NextResponse.json({ message: "Invalid report action" }, { status: 400 })
  }

  return proxyUpstreamRequest(
    request,
    `/admin/reports/${encodeURIComponent(uuid)}/${action}`,
    "PATCH"
  )
}
