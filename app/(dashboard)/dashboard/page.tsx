import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, AlertCircle, CheckCircle2, Server } from "lucide-react"
import { FaxListSection } from "@/components/dashboard/fax-list-section"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
      </div>

      {/* KPIカード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 本日の受信数 */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">本日の受信数</CardTitle>
            <Inbox className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">182</div>
          </CardContent>
        </Card>

        {/* 未処理（要確認） */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">未処理（要確認）</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">25</div>
          </CardContent>
        </Card>

        {/* 処理完了 */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">処理完了</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">157</div>
          </CardContent>
        </Card>

        {/* システム稼働率 */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">システム稼働率</CardTitle>
            <Server className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">99.9%</div>
          </CardContent>
        </Card>
      </div>

      {/* 未確認FAX一覧セクション */}
      <Suspense fallback={<FaxListSkeleton />}>
        <FaxListSection />
      </Suspense>
    </div>
  )
}

function FaxListSkeleton() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-slate-900">未確認FAX一覧（AI解析済み）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="flex gap-3">
            <div className="h-10 bg-slate-200 rounded w-40" />
            <div className="h-10 bg-slate-200 rounded w-40" />
            <div className="h-10 bg-slate-200 rounded w-48" />
            <div className="h-10 bg-slate-200 rounded w-36" />
          </div>
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}
