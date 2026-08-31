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

/**
 * Turn an RTK Query rejection into something worth showing a user.
 *
 * RTK rejects with `{ status, data }`, never with an `Error`, so the common
 * `err instanceof Error ? err.message : fallback` check always loses the
 * server's message. Upstream returns `{ message, code, status }` for most
 * failures and Spring's field errors for a 400, so pull the most specific
 * text available.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback
  }

  const candidate = error as { status?: unknown; data?: unknown; message?: unknown }
  const data = candidate.data

  if (typeof data === "string" && data.trim()) {
    return data
  }

  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>

    // Spring validation: the response names the offending field.
    const fieldErrors = body.errors ?? body.fieldErrors ?? body.violations
    if (Array.isArray(fieldErrors) && fieldErrors.length) {
      const described = fieldErrors
        .map((entry) => {
          const item = (entry ?? {}) as Record<string, unknown>
          const field = toText(item.field) || toText(item.propertyPath)
          const detail =
            toText(item.defaultMessage) || toText(item.message) || toText(item.error)

          if (field && detail) return `${field}: ${detail}`
          return detail || field
        })
        .filter(Boolean)

      if (described.length) {
        return described.join("; ")
      }
    }

    for (const key of ["message", "detail", "error", "title"]) {
      const value = body[key]
      if (typeof value === "string" && value.trim()) {
        return value
      }
    }
  }

  // A network/parsing failure surfaces as a SerializedError with a message.
  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message
  }

  if (typeof candidate.status === "number") {
    return `${fallback} (HTTP ${candidate.status})`
  }

  if (typeof candidate.status === "string") {
    return `${fallback} (${candidate.status})`
  }

  return fallback
}

export function extractList(response: unknown, key: string = "users") {
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
