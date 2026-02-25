"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { LeaveRequest, ApprovalStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">承認待ち</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">承認済み</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">却下</Badge>
}

// Mini calendar component for February 2026
function MiniCalendar({ highlightDates }: { highlightDates: string[] }) {
  const daysInMonth = 28
  const startDayOfWeek = 6 // Feb 1, 2026 is Sunday (0-indexed as 6 for Japanese calendar Mon start)
  // Actually Feb 1 2026 is a Sunday. For Mon-start calendar: offset = 6
  const dayLabels = ["月", "火", "水", "木", "金", "土", "日"]
  const cells: (number | null)[] = []
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Parse highlight dates like "2/28" -> 28
  const highlightSet = new Set(
    highlightDates.map((d) => {
      const parts = d.split("/")
      return Number(parts[parts.length - 1])
    })
  )

  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="text-sm font-medium text-slate-700 mb-2">2026年2月</div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {dayLabels.map((d) => (
          <div key={d} className="py-1 text-slate-400 font-medium">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`py-1 rounded ${
              day === null
                ? ""
                : highlightSet.has(day)
                  ? "bg-blue-100 text-blue-800 font-semibold"
                  : "text-slate-600"
            }`}
          >
            {day ?? ""}
          </div>
        ))}
      </div>
    </div>
  )
}

interface LeaveDetailPanelProps {
  request: LeaveRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function LeaveDetailPanel({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LeaveDetailPanelProps) {
  if (!request) return null

  const { detail } = request

  // Create array of highlight dates
  const highlightDates: string[] = []
  // Parse startDate "2/28" and endDate "2/28"
  const startDay = Number(request.startDate.split("/")[1])
  const endDay = Number(request.endDate.split("/")[1])
  for (let d = startDay; d <= endDay; d++) {
    highlightDates.push(`2/${d}`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">
              {request.workerName}
            </SheetTitle>
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            休暇申請 - {request.requestedAt}
          </SheetDescription>
          <div className="flex items-center gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={onPrev} disabled={!hasPrev} className="text-slate-500 hover:text-slate-900 h-7 px-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              前の申請
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm" onClick={onNext} disabled={!hasNext} className="text-slate-500 hover:text-slate-900 h-7 px-2">
              次の申請
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Section 1: 申請情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              申請情報
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">作業員</span>
                <p className="font-medium text-slate-900">{request.workerName}（No.{request.workerNo}）</p>
              </div>
              <div>
                <span className="text-slate-500">休暇種別</span>
                <p className="font-medium text-slate-900">{request.leaveType}</p>
              </div>
              <div>
                <span className="text-slate-500">対象期間</span>
                <p className="font-medium text-slate-900">
                  {request.startDate}{request.startDate !== request.endDate ? ` 〜 ${request.endDate}` : ""}
                </p>
              </div>
              <div>
                <span className="text-slate-500">日数</span>
                <p className="font-medium text-slate-900">{request.days}日</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">理由</span>
                <p className="font-medium text-slate-900">{request.reason}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 有給残日数の詳細 */}
          {request.leaveType === "有給" && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  有給残日数の詳細
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2.5 text-slate-500">年間付与日数</td>
                        <td className="px-3 py-2.5 text-right font-medium text-slate-700">{detail.annualGranted}日</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2.5 text-slate-500">使用済み</td>
                        <td className="px-3 py-2.5 text-right font-medium text-slate-700">{detail.used}日</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2.5 text-slate-500">今回申請分</td>
                        <td className="px-3 py-2.5 text-right font-medium text-slate-700">{detail.thisRequest}日</td>
                      </tr>
                      <tr className="bg-blue-50/50">
                        <td className="px-3 py-3 text-blue-800 font-semibold">承認後の残日数</td>
                        <td className="px-3 py-3 text-right font-bold text-blue-800 text-base">{detail.afterApproval}日</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Separator className="mb-6" />
            </>
          )}

          {/* Section 3: カレンダー */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              当月の勤務カレンダー
            </h3>
            <MiniCalendar highlightDates={highlightDates} />
          </div>

          {/* Data integration note */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
            勤務状況カレンダーに反映されます
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          {request.status === "未処理" && (
            <>
              <Button
                onClick={() => {
                  onApprove(request.id)
                  onOpenChange(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                承認
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onReject(request.id)
                  onOpenChange(false)
                }}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                却下
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
