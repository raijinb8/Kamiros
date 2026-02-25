"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AdvanceTab } from "@/components/requests/advance-tab"
import { SiteConditionTab } from "@/components/requests/site-condition-tab"
import { LeaveTab } from "@/components/requests/leave-tab"
import { ExpenseTab } from "@/components/requests/expense-tab"
import { OtherTab } from "@/components/requests/other-tab"
import { Toaster } from "sonner"

// Static badge counts (in real app, these would be dynamic)
const TAB_BADGES = {
  advance: 4,
  siteCondition: 2,
  leave: 3,
  expense: 1,
  other: 1,
}

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <Badge
      className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px] font-semibold bg-orange-500 text-white border-orange-500 rounded-full"
      variant="default"
    >
      {count}
    </Badge>
  )
}

export default function RequestsPage() {
  return (
    <div className="space-y-6 min-w-0">
      <Toaster position="top-right" richColors />

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          申請管理
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="advance" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10 flex-wrap">
          <TabsTrigger
            value="advance"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            内金申請
            <TabBadge count={TAB_BADGES.advance} />
          </TabsTrigger>
          <TabsTrigger
            value="site-condition"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            現場状況
            <TabBadge count={TAB_BADGES.siteCondition} />
          </TabsTrigger>
          <TabsTrigger
            value="leave"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            休暇
            <TabBadge count={TAB_BADGES.leave} />
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            経費
            <TabBadge count={TAB_BADGES.expense} />
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            その他
            <TabBadge count={TAB_BADGES.other} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advance" className="mt-4">
          <AdvanceTab />
        </TabsContent>

        <TabsContent value="site-condition" className="mt-4">
          <SiteConditionTab />
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
