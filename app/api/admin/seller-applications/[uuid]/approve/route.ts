import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params
  return proxyUpstreamRequest(
    request,
    `/admin/seller-applications/${encodeURIComponent(uuid)}/approve`,
    "PATCH",
  )
}
