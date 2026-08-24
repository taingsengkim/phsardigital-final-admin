import { proxyUpstreamRequest } from "@/lib/upstream-api"

/**
 * The upstream API does not expose an admin seller-directory endpoint.
 * Use its seller-profile ranking source instead of reusing seller applications.
 */
export async function GET(request: Request) {
  return proxyUpstreamRequest(
    request,
    "/sellers/top?basis=ORDERS&period=ALL_TIME&limit=50",
    "GET",
  )
}
