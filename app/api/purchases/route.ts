import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function GET(request: Request) {
  const url = new URL(request.url)
  return proxyUpstreamRequest(request, `/purchases${url.search}`, "GET")
}
