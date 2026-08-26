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
      const raw = await summaryRes.json()
      const data = (raw?.data ?? raw?.payload ?? raw?.summary ?? raw) as Record<string, any>

      const totalUsers = Number(data.totalUsers ?? data.usersCount ?? data.total_users ?? 0)
      const totalSellers = Number(data.totalSellers ?? data.sellersCount ?? data.total_sellers ?? 0)
      const rawBuyers = data.totalBuyers ?? data.buyersCount ?? data.total_buyers
      const totalBuyers = rawBuyers !== undefined ? Number(rawBuyers) : Math.max(0, totalUsers - totalSellers)

      const summary: AdminDashboardSummary = {
        totalUsers,
        totalBuyers,
        totalSellers,
        activeSellers: Number(data.activeSellers ?? data.active_sellers ?? totalSellers),
        totalListings: Number(data.totalListings ?? data.listingsCount ?? data.total_listings ?? 0),
        activeListings: Number(data.activeListings ?? data.active_listings ?? data.totalListings ?? 0),
        pendingApplications: Number(data.pendingApplications ?? data.pending_applications ?? 0),
        pendingDocuments: Number(data.pendingDocuments ?? data.pending_documents ?? 0),
        totalTransactions: Number(data.completedPurchases ?? data.totalTransactions ?? data.completed_purchases ?? 0),
        totalRevenue: Number(data.completedSalesValue ?? data.totalRevenue ?? data.completed_sales_value ?? 0),
        activeSubscriptions: Number(data.activeSubscriptions ?? data.active_subscriptions ?? 0),
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

    const getTotalCount = (result: PromiseSettledResult<unknown>, list: any[]) => {
      if (result.status !== "fulfilled" || !result.value) return list.length
      const val = result.value as Record<string, unknown>
      return Number(val.totalElements ?? val.total ?? val.count ?? list.length)
    }

    const users = getList(usersData)
    const applications = getList(appsData)
    const purchases = getList(purchasesData)
    const listings = getList(listingsData)

    const totalUsersCount = getTotalCount(usersData, users)
    const totalListingsCount = getTotalCount(listingsData, listings)

    const sellerCount = users.filter((u: any) => {
      const roles = Array.isArray(u?.roles) ? u.roles : (typeof u?.roles === "string" ? u.roles.split(",") : [])
      return roles.some((r: string) => r.toUpperCase().includes("SELLER"))
    }).length

    const summary: AdminDashboardSummary = {
      totalUsers: totalUsersCount,
      totalBuyers: Math.max(0, totalUsersCount - sellerCount),
      totalSellers: sellerCount,
      activeListings: listings.filter((l: any) => String(l?.status).toUpperCase() === "ACTIVE" || !l?.status).length || totalListingsCount,
      pendingApplications: applications.filter((a: any) => String(a?.status).toUpperCase().includes("PENDING")).length,
      pendingDocuments: applications.filter((a: any) => String(a?.status).toUpperCase().includes("PENDING") && (Array.isArray(a?.documents) && a.documents.length > 0)).length,
      totalTransactions: purchases.length,
      totalRevenue: purchases.reduce((acc: number, p: any) => acc + (Number(p?.totalPrice ?? p?.amount ?? p?.price) || 0), 0),
      unavailableSources: [],
    }

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ message: "Unable to load dashboard summary" }, { status: 500 })
  }
}
