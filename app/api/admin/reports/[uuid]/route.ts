import { NextRequest } from "next/server"
import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params
  return proxyUpstreamRequest(
    request,
    `/admin/reports/${encodeURIComponent(uuid)}`,
    "GET"
  )
}
