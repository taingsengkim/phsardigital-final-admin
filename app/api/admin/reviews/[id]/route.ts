import { NextRequest } from "next/server"
import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyUpstreamRequest(
    request,
    `/admin/reviews/${encodeURIComponent(id)}`,
    "DELETE"
  )
}
