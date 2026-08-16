import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function GET(request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  return proxyUpstreamRequest(request, `/purchases/${encodeURIComponent(uuid)}`, "GET")
}
