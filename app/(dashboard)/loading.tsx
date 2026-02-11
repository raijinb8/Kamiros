export default function DashboardLayoutLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="text-sm text-slate-500">読み込み中...</p>
      </div>
    </div>
  )
}
