import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PayrollLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />

      {/* Tabs skeleton */}
      <div className="h-10 w-80 bg-slate-200 rounded animate-pulse" />

      {/* Filter skeleton */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 w-36 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI skeleton */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-slate-50">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-10 border-b border-slate-100 flex items-center px-4 gap-4"
          >
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
