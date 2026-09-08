import { NextRequest } from "next/server"
import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params
  return proxyUpstreamRequest(
    request,
    `/admin/listings/${encodeURIComponent(uuid)}`,
    "DELETE"
  )
}
