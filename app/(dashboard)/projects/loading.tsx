import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <div className="space-y-4">
      {/* Title + calendar button */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Date strip tabs */}
      <div className="flex gap-1.5 overflow-hidden pb-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-12 rounded-lg shrink-0" />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-48 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 flex items-center gap-6">
          {[48, 120, 180, 40, 56, 48, 120, 40, 40].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-t border-slate-100 flex items-center gap-6">
            <Skeleton className="h-4 w-12" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-7 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
