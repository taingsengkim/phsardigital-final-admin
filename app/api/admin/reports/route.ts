import { NextRequest } from "next/server"
import { proxyUpstreamRequest } from "@/lib/upstream-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const upstreamParams = new URLSearchParams()

  const status = searchParams.get("status")
  const targetType = searchParams.get("targetType")
  const pageNumber = searchParams.get("pageNumber")
  const pageSize = searchParams.get("pageSize")

  if (status && status !== "ALL") {
    upstreamParams.set("status", status)
  }
  if (targetType && targetType !== "ALL") {
    upstreamParams.set("targetType", targetType)
  }
  if (pageNumber !== null && pageNumber !== undefined) {
    upstreamParams.set("pageNumber", pageNumber)
  }
  if (pageSize !== null && pageSize !== undefined) {
    upstreamParams.set("pageSize", pageSize)
  }

  const query = upstreamParams.toString()
  const path = `/admin/reports${query ? `?${query}` : ""}`

  return proxyUpstreamRequest(request, path, "GET")
}
