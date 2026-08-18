export interface AdminDashboardSummary {
  totalUsers: number
  totalBuyers?: number
  totalSellers: number
  activeSellers?: number
  totalListings?: number
  activeListings: number
  pendingApplications: number
  pendingDocuments?: number
  totalTransactions?: number
  totalRevenue?: number
  completedPurchases?: number
  completedSalesValue?: number
  activeSubscriptions?: number
  activeSubscriptionsByPlan?: Record<string, number>
  unavailableSources?: string[]
}
