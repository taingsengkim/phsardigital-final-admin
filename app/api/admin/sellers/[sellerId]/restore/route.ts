import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId } = await params
  return proxyUpstreamRequest(
    request,
    `/admin/sellers/${sellerId}/restore`,
    "PATCH"
  )
}
