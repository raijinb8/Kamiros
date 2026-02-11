import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SendPageLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-80 bg-slate-200 rounded" />

      {/* Info Banner */}
      <div className="h-14 bg-blue-50 border border-blue-200 rounded-lg" />

      {/* Worker list */}
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 w-32 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-50 h-10 flex items-center gap-4 px-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 flex items-center gap-4 px-4 border-t">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-10 w-24 bg-slate-200 rounded" />
        <div className="h-12 w-48 bg-slate-200 rounded" />
      </div>
    </div>
  )
}
