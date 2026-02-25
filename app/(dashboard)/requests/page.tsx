"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AttendanceTab } from "@/components/requests/attendance-tab"
import { LeaveTab } from "@/components/requests/leave-tab"
import { ExpenseTab } from "@/components/requests/expense-tab"
import { OtherTab } from "@/components/requests/other-tab"
import { Toaster } from "sonner"
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_LEAVE,
  SAMPLE_EXPENSE,
  SAMPLE_OTHER,
} from "@/lib/request-data"

function PendingBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Badge className="ml-1.5 bg-orange-500 text-white border-orange-500 text-[10px] leading-none px-1.5 py-0.5 min-w-[18px] text-center">
      {count}
    </Badge>
  )
}

export default function RequestsPage() {
  // Calculate pending counts from initial data
  // In a real app these would come from the tab state or server
  const pendingCounts = useMemo(() => ({
    attendance: SAMPLE_ATTENDANCE.filter((r) => r.status === "承認待ち").length,
    leave: SAMPLE_LEAVE.filter((r) => r.status === "承認待ち").length,
    expense: SAMPLE_EXPENSE.filter((r) => r.status === "承認待ち").length,
    other: SAMPLE_OTHER.filter((r) => r.status === "承認待ち").length,
  }), [])

  return (
    <div className="space-y-6 min-w-0">
      <Toaster position="top-right" richColors />

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">申請管理</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10">
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            打刻
            <PendingBadge count={pendingCounts.attendance} />
          </TabsTrigger>
          <TabsTrigger
            value="leave"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            休暇
            <PendingBadge count={pendingCounts.leave} />
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            経費
            <PendingBadge count={pendingCounts.expense} />
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            その他
            <PendingBadge count={pendingCounts.other} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <LeaveTab />
        </TabsContent>

        <TabsContent value="expense" className="mt-4">
          <ExpenseTab />
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <OtherTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
