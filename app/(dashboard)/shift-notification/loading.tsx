import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ShiftNotificationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-96 bg-slate-200 rounded" />

      {/* Info Banner */}
      <div className="h-14 bg-blue-50 border border-blue-200 rounded-lg" />

      {/* Date Section */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-64 bg-slate-200 rounded mt-1" />
        </CardHeader>
        <CardContent>
          <div className="h-10 w-48 bg-slate-200 rounded" />
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-40 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-slate-200 rounded" />
          <div className="flex gap-4">
            <div className="h-10 w-40 bg-slate-200 rounded" />
            <div className="h-10 w-44 bg-slate-200 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-16 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="bg-slate-50 h-10 flex items-center gap-4 px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 flex items-center gap-4 px-4 border-t">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Preview Section */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-64 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-12 bg-slate-50 flex items-center justify-center">
            <div className="h-12 w-12 bg-slate-200 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
