import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function PATCH(request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  return proxyUpstreamRequest(request, `/purchases/${encodeURIComponent(uuid)}/complete`, "PATCH")
}
