import { NextResponse } from "next/server"
import { getAuthHeader, requireAdmin } from "@/lib/auth"
import type { AdminDashboardSummary } from "@/lib/types/dashboard"

const upstreamApiUrl = (process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1").replace(/\/$/, "")

export async function GET(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  const authHeaders = await getAuthHeader(request)
  if (!authHeaders.Authorization) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    // Primary: Call the official /admin/dashboard/summary endpoint
    const summaryRes = await fetch(`${upstreamApiUrl}/admin/dashboard/summary`, {
      headers: { Accept: "application/json", ...authHeaders },
      cache: "no-store",
    })

    if (summaryRes.ok) {
      const data = await summaryRes.json()
      const summary: AdminDashboardSummary = {
        totalUsers: data.totalUsers ?? 0,
        totalBuyers: (data.totalUsers ?? 0) - (data.totalSellers ?? 0),
        totalSellers: data.totalSellers ?? 0,
        activeSellers: data.activeSellers ?? 0,
        totalListings: data.totalListings ?? 0,
        activeListings: data.activeListings ?? 0,
        pendingApplications: data.pendingApplications ?? 0,
        pendingDocuments: 0,
        totalTransactions: data.completedPurchases ?? 0,
        totalRevenue: data.completedSalesValue ?? 0,
        activeSubscriptions: data.activeSubscriptions ?? 0,
        activeSubscriptionsByPlan: data.activeSubscriptionsByPlan ?? {},
        unavailableSources: [],
      }
      return NextResponse.json(summary)
    }
  } catch (err) {
    console.warn("Direct /admin/dashboard/summary fetch failed, falling back to aggregated sources", err)
  }

  // Fallback: Aggregate from sources if summary endpoint fails
  try {
    const fetchSource = async (path: string) => {
      const res = await fetch(`${upstreamApiUrl}${path}`, {
        headers: { Accept: "application/json", ...authHeaders },
        cache: "no-store",
      })
      if (!res.ok) throw new Error(`${path}: ${res.status}`)
      return res.json()
    }

    const [usersData, appsData, purchasesData, listingsData] = await Promise.allSettled([
      fetchSource("/admin/users"),
      fetchSource("/admin/seller-applications"),
      fetchSource("/purchases"),
      fetchSource("/listings"),
    ])

    const getList = (result: PromiseSettledResult<unknown>) => {
      if (result.status !== "fulfilled" || !result.value) return []
      const val = result.value as Record<string, unknown>
      const list = val.content ?? val.data ?? val.items ?? val.results ?? val
      return Array.isArray(list) ? list : []
    }

    const users = getList(usersData)
    const applications = getList(appsData)
    const purchases = getList(purchasesData)
    const listings = getList(listingsData)

    const summary: AdminDashboardSummary = {
      totalUsers: users.length,
      totalBuyers: users.filter((u: any) => !u?.roles?.includes("SELLER")).length,
      totalSellers: users.filter((u: any) => u?.roles?.includes("SELLER")).length,
      activeListings: listings.filter((l: any) => l?.status === "ACTIVE").length,
      pendingApplications: applications.filter((a: any) => String(a?.status).includes("PENDING")).length,
      pendingDocuments: 0,
      totalTransactions: purchases.length,
      totalRevenue: purchases.reduce((acc: number, p: any) => acc + (Number(p?.totalPrice ?? p?.amount) || 0), 0),
      unavailableSources: [],
    }

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ message: "Unable to load dashboard summary" }, { status: 500 })
  }
}
