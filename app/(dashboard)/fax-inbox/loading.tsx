export default function FaxInboxLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-pulse">
      {/* Header skeleton */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="h-6 w-28 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-32 bg-slate-200 rounded" />
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PDF Preview */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-[560px] h-[792px] bg-slate-200 rounded shadow-md" />
          </div>
          <div className="p-3 border-t border-slate-200 bg-white flex justify-center gap-3">
            <div className="h-8 w-16 bg-slate-200 rounded" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-3 border-b border-slate-200">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-200 rounded mt-2" />
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
