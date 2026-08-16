"use client"

import { useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PurchaseTable } from "@/components/purchases/purchase-table"
import { PurchaseActivityLog } from "@/components/purchases/purchase-activity"
import { OrderQuickView } from "@/components/purchases/purchase-details"
import { 
  TrendingUpIcon,
} from "lucide-react"
import { useGetPurchasesQuery } from "@/lib/redux/service/purchaseApi"
import type { Purchase } from "@/lib/types/purchase"

export default function PurchasesPage() {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const { data: purchases = [], isLoading, isError, refetch } = useGetPurchasesQuery()
  const totalOrders = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Purchase Orders & Management" 
          description="Sophisticated, data-rich table view for stats, and data executive."
        />
        
        <div className="flex min-h-[calc(100vh-88px)]">
          <div className={`flex-1 p-8 space-y-8 ${selectedPurchase ? "max-w-[calc(100vw-300px-350px)]" : ""}`}>
            {/* Top Stats */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm inline-flex items-center gap-6 min-w-[300px]">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Orders (Current Month)</p>
                <div className="flex items-center gap-3">
                  <h4 className="text-3xl font-bold">{isLoading ? "..." : `$${totalOrders.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</h4>
                  <div className="size-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <TrendingUpIcon size={14} />
                  </div>
                </div>
              </div>
            </div>

            {isError && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                Failed to load purchases. <button type="button" onClick={() => refetch()} className="font-semibold underline">Retry</button>
              </div>
            )}
            <PurchaseTable
              purchases={purchases}
              selectedId={selectedPurchase?.id ?? null}
              isLoading={isLoading}
              onSelect={setSelectedPurchase}
            />
            
            <PurchaseActivityLog />
          </div>

          {selectedPurchase && (
            <aside className="w-[350px] shrink-0 sticky top-[88px] h-[calc(100vh-88px)]">
              <OrderQuickView purchase={selectedPurchase} onClose={() => setSelectedPurchase(null)} />
            </aside>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
