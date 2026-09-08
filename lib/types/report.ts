export type ReportTargetType = "LISTING" | "SELLER" | "REVIEW"

export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED"

export interface AdminReport {
  uuid: string
  reporterId: string
  targetType: ReportTargetType
  targetId: string
  targetLabel: string
  reason: string
  note: string
  status: ReportStatus
  createdAt: string
  reviewedBy?: string | null
  reviewedAt?: string | null
  decisionNote?: string | null
}

export interface ReportsPageMeta {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface ReportsResponse {
  content: AdminReport[]
  page: ReportsPageMeta
}

export interface GetReportsQuery {
  status?: ReportStatus | "ALL"
  targetType?: ReportTargetType | "ALL"
  pageNumber?: number
  pageSize?: number
}

export interface ResolveReportPayload {
  uuid: string
  note?: string
}

export interface DismissReportPayload {
  uuid: string
  note?: string
}

export interface SuspendListingPayload {
  targetId: string
  reason: string
}

export interface RemoveListingPayload {
  targetId: string
  reason?: string
}

export interface SuspendSellerPayload {
  targetId: string
  reason: string
}
