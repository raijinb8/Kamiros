"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingClosingTab } from "@/components/billing/billing-closing-tab"
import { BillingHistoryTab } from "@/components/billing/billing-history-tab"
import { BillingUnitPriceTab } from "@/components/billing/billing-unit-price-tab"
import { Toaster } from "sonner"

export default function BillingPage() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">請求管理</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="closing" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10">
          <TabsTrigger
            value="closing"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            締め・発行
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            請求実績
          </TabsTrigger>
          <TabsTrigger
            value="unit-price"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            単価設定
          </TabsTrigger>
        </TabsList>

        <TabsContent value="closing" className="mt-4">
          <BillingClosingTab />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <BillingHistoryTab />
        </TabsContent>

        <TabsContent value="unit-price" className="mt-4">
          <BillingUnitPriceTab />
        </TabsContent>
      </Tabs>

      <Toaster position="top-right" richColors />
    </div>
  )
}
