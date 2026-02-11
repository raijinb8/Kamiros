import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-48 bg-slate-200 rounded" />

      {/* KPI Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-slate-50 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-5 w-5 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-9 w-16 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAX List skeleton */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-64 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="h-10 bg-slate-200 rounded w-40" />
            <div className="h-10 bg-slate-200 rounded w-40" />
            <div className="h-10 bg-slate-200 rounded w-48" />
            <div className="h-10 bg-slate-200 rounded w-36" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
