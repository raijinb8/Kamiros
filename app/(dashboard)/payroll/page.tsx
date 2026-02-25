"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollCalculationTab } from "@/components/payroll/payroll-calculation-tab"
import { PayrollHistoryTab } from "@/components/payroll/payroll-history-tab"
import { PayrollAttendanceTab } from "@/components/payroll/payroll-attendance-tab"
import { Toaster } from "sonner"

export default function PayrollPage() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">給与管理</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calculation" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10">
          <TabsTrigger
            value="calculation"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            給与計算
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            給与実績
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            勤務状況
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="mt-4">
          <PayrollCalculationTab />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <PayrollHistoryTab />
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <PayrollAttendanceTab />
        </TabsContent>
      </Tabs>

      <Toaster position="top-right" richColors />
    </div>
  )
}
