export const apiBaseUrl = (process.env.NEXT_PUBLIC_API ?? "/api").replace(/\/$/, "")

export function toText(value: unknown, fallback = "") {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return fallback
}

export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

export function extractList(response: unknown, key: "buyers" | "sellers" | "users") {
  if (Array.isArray(response)) return response

  const record = (response ?? {}) as Record<string, unknown>
  const data = record.data

  if (Array.isArray(data)) return data

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>
    const nestedList = nested[key] ?? nested.content ?? nested.items ?? nested.results
    if (Array.isArray(nestedList)) return nestedList
  }

  const list = record[key] ?? record.content ?? record.items ?? record.results ?? record.payload
  return Array.isArray(list) ? list : []
}
