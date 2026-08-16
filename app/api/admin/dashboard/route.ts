import { NextResponse } from "next/server"

import { getAuthHeader } from "@/lib/auth"
import type { AdminDashboardSummary } from "@/lib/types/dashboard"

const upstreamApiUrl = (process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1").replace(/\/$/, "")

function unwrapList(response: unknown, keys: string[]) {
  if (Array.isArray(response)) return response
  if (!response || typeof response !== "object") return []

  const record = response as Record<string, unknown>
  const data = record.data
  if (Array.isArray(data)) return data

  const container = data && typeof data === "object" ? data as Record<string, unknown> : record
  for (const key of ["content", "items", "results", ...keys]) {
    if (Array.isArray(container[key])) return container[key]
  }
  return []
}

function text(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value)
}

function number(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = Number(text(value).replace(/[^\d.-]/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}

function hasRole(value: unknown, role: "BUYER" | "SELLER") {
  const record = (value ?? {}) as Record<string, unknown>
  const roles = Array.isArray(record.roles) ? record.roles : []
  return [record.role, record.type, record.userType, record.accountType, ...roles]
    .map((entry) => entry && typeof entry === "object" ? (entry as Record<string, unknown>).name : entry)
    .map((entry) => text(entry).toUpperCase())
    .join(" ")
    .includes(role)
}

async function fetchSource(path: string, authHeaders: Record<string, string>) {
  const response = await fetch(`${upstreamApiUrl}${path}`, {
    headers: { Accept: "application/json", ...authHeaders },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`${path}: ${response.status}`)
  return response.json() as Promise<unknown>
}

export async function GET(request: Request) {
  const authHeaders = await getAuthHeader(request)
  if (!authHeaders.Authorization) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const sources = {
    users: "/admin/users",
    applications: "/admin/seller-applications",
    categories: "/categories",
    purchases: "/purchases",
    listings: "/listings",
  } as const

  const entries = await Promise.all(
    Object.entries(sources).map(async ([name, path]) => {
      try {
        return [name, await fetchSource(path, authHeaders)] as const
      } catch {
        return [name, null] as const
      }
    }),
  )
  const data = Object.fromEntries(entries) as Record<keyof typeof sources, unknown>
  const unavailableSources = entries.filter(([, value]) => value === null).map(([name]) => name)

  const users = unwrapList(data.users, ["users"])
  const applications = unwrapList(data.applications, ["applications"])
  const purchases = unwrapList(data.purchases, ["purchases", "orders"])
  const listings = unwrapList(data.listings, ["listings", "products"])

  const summary: AdminDashboardSummary = {
    totalUsers: users.length,
    totalBuyers: users.filter((user) => hasRole(user, "BUYER")).length,
    totalSellers: users.filter((user) => hasRole(user, "SELLER")).length,
    activeListings: listings.filter((value) => {
      const listing = (value ?? {}) as Record<string, unknown>
      return listing.active === true || listing.isActive === true || listing.live === true || text(listing.status).toUpperCase() === "ACTIVE"
    }).length,
    pendingApplications: applications.filter((value) => text(((value ?? {}) as Record<string, unknown>).status).toUpperCase().includes("PENDING")).length,
    pendingDocuments: 0,
    totalTransactions: purchases.length,
    totalRevenue: purchases.reduce((sum, value) => {
      const purchase = (value ?? {}) as Record<string, unknown>
      return sum + number(purchase.totalAmount ?? purchase.total ?? purchase.amount)
    }, 0),
    unavailableSources,
  }

  return NextResponse.json(summary)
}
