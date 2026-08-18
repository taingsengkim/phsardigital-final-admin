import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function GET(request: Request) {
  return proxyUpstreamRequest(
    request,
    "/subscriptions/plans",
    "GET",
  )
}
