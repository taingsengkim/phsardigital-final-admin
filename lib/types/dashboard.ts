export interface AdminDashboardSummary {
  totalUsers: number
  totalBuyers: number
  totalSellers: number
  activeListings: number
  pendingApplications: number
  pendingDocuments: number
  totalTransactions: number
  totalRevenue: number
  unavailableSources: string[]
}
