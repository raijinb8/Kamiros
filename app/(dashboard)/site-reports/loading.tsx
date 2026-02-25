import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SiteReportsLoading() {
  return (
    <div className="space-y-5">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* KPI skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-50">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-36 bg-slate-200 rounded animate-pulse" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-10 border-b border-slate-100 flex items-center px-4 gap-4"
          >
            <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
