import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader, requireAdmin } from "@/lib/auth";

const BASE_URL = (
  process.env.UPSTREAM_API_URL ?? "https://phsardigital.quizzy.it.com/api/v1"
).replace(/\/$/, "");

/** Upstream caps pageSize at 100 on the paged endpoints we walk here. */
const MAX_PAGE_SIZE = 100;
/** Stops a bad totalPages from turning a page load into an unbounded sweep. */
const MAX_PAGES = 25;
/** Ceiling on the per-seller profile fan-out. */
const MAX_SELLERS = 200;
const PROFILE_CONCURRENCY = 8;
/** `/sellers/top` rejects a limit above 50. */
const TOP_SELLERS_LIMIT = 50;
/** Listings are only a fallback source of seller ids - keep that sweep short. */
const LISTING_DISCOVERY_PAGES = 5;

type Json = Record<string, unknown>;

function asRecord(value: unknown): Json {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {};
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function getJson(path: string, headers: Record<string, string>) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json", ...headers },
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { ok: response.ok, status: response.status, data };
}

function pageContent(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const content = asRecord(data).content;
  return Array.isArray(content) ? content : [];
}

function pageTotalPages(data: unknown) {
  const total = asRecord(asRecord(data).page).totalPages;
  return typeof total === "number" && total > 0 ? total : 1;
}

/** Walks every page of a paged upstream collection. */
async function collectPages(
  path: string,
  headers: Record<string, string>,
  maxPages = MAX_PAGES,
) {
  const items: unknown[] = [];
  let totalPages = 1;

  for (let pageNumber = 0; pageNumber < totalPages && pageNumber < maxPages; pageNumber += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const result = await getJson(
      `${path}${separator}pageNumber=${pageNumber}&pageSize=${MAX_PAGE_SIZE}`,
      headers,
    );

    if (!result.ok) {
      return { items, failed: true as const, status: result.status, data: result.data };
    }

    items.push(...pageContent(result.data));
    totalPages = pageTotalPages(result.data);
  }

  return { items, failed: false as const, status: 200, data: null };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
) {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index]);
      }
    }),
  );

  return results;
}

/**
 * The upstream API has no admin seller-directory endpoint, so the directory is
 * composed here.
 *
 * `/sellers/top` alone is an orders leaderboard: it only contains sellers with
 * at least one completed order, which is why this route used to return a single
 * seller. Instead, collect every seller id the admin can see - approved
 * applications, the leaderboard, and the sellers behind live listings - then
 * read each one's real profile for status, rating and location.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const authHeaders = await getAuthHeader(request);

    const [applications, listings, top] = await Promise.all([
      collectPages("/admin/seller-applications?status=APPROVED", authHeaders),
      // Supplementary discovery only - approved applications are the roster of
      // record, so this does not need to walk a large catalogue.
      collectPages("/listings", authHeaders, LISTING_DISCOVERY_PAGES),
      // `limit` is capped at 50 upstream; anything higher is a 400.
      getJson(`/sellers/top?basis=ORDERS&period=ALL_TIME&limit=${TOP_SELLERS_LIMIT}`, authHeaders),
    ]);

    const sellerIds = new Set<string>();

    for (const application of applications.items) {
      const applicantId = asText(asRecord(application).applicantId);
      if (applicantId) sellerIds.add(applicantId);
    }

    for (const listing of listings.items) {
      const sellerId = asText(asRecord(asRecord(listing).sellerProfile).sellerId);
      if (sellerId) sellerIds.add(sellerId);
    }

    const topRows = Array.isArray(top.data) ? top.data : [];
    const topBySellerId = new Map<string, Json>();

    for (const row of topRows) {
      const record = asRecord(row);
      const sellerId = asText(record.sellerId);
      if (sellerId) {
        sellerIds.add(sellerId);
        topBySellerId.set(sellerId, record);
      }
    }

    // Every source failed - surface the upstream error rather than an empty list.
    if (sellerIds.size === 0 && applications.failed && listings.failed && !top.ok) {
      const status = applications.status || listings.status || top.status || 502;
      const body = applications.data ?? listings.data ?? top.data;

      return NextResponse.json(
        body && typeof body === "object" ? body : { message: "Failed to fetch sellers" },
        { status },
      );
    }

    const ids = [...sellerIds].slice(0, MAX_SELLERS);

    const sellers = await mapWithConcurrency(ids, PROFILE_CONCURRENCY, async (sellerId) => {
      const profileResult = await getJson(`/sellers/${encodeURIComponent(sellerId)}`, authHeaders);
      // A id that no longer resolves to a profile is skipped below.
      const profile = profileResult.ok ? asRecord(profileResult.data) : null;
      const ranked = topBySellerId.get(sellerId) ?? {};

      if (!profile) return null;

      return {
        sellerId,
        businessName: profile.businessName ?? ranked.businessName ?? "",
        businessType: profile.businessType ?? "",
        logoUri: profile.logoUri ?? ranked.logoUri ?? null,
        city: profile.city ?? ranked.city ?? null,
        province: profile.province ?? ranked.province ?? null,
        address: profile.address ?? null,
        phoneNumber: profile.phoneNumber ?? null,
        isActive: profile.isActive ?? true,
        suspensionReason: profile.suspensionReason ?? null,
        suspendedAt: profile.suspendedAt ?? null,
        averageRating: profile.averageRating ?? ranked.averageRating ?? null,
        reviewCount: profile.reviewCount ?? ranked.reviewCount ?? 0,
        completedOrders: ranked.completedOrders ?? 0,
      };
    });

    const directory = sellers.filter((seller) => seller !== null);

    directory.sort((left, right) =>
      asText(left.businessName).localeCompare(asText(right.businessName)),
    );

    return NextResponse.json(directory, { status: 200 });
  } catch (err: unknown) {
    console.error("GET Sellers directory error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Service unavailable." },
      { status: 502 },
    );
  }
}
