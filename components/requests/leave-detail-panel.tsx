"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { LeaveRequest, RequestStatus, LeaveType } from "@/lib/request-data"

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "承認待ち") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">{status}</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">{status}</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">{status}</Badge>
}

function LeaveTypeBadge({ type }: { type: LeaveType }) {
  if (type === "有給") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">{type}</Badge>
  }
  return <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">{type}</Badge>
}

// Simple calendar component for the detail panel
function MiniCalendar({ targetStart, targetEnd }: { targetStart: string; targetEnd: string }) {
  const days = ["月", "火", "水", "木", "金", "土", "日"]
  // Feb 2026 starts on Sunday (index 6 in our Mon-start grid)
  const daysInMonth = 28
  const startDayIndex = 6 // Sunday
  const cells: (number | null)[] = []

  for (let i = 0; i < startDayIndex; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  // Parse target dates (e.g., "2/28" -> 28)
  const startDay = parseInt(targetStart.split("/")[1] || "0")
  const endDay = parseInt(targetEnd.split("/")[1] || "0")

  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="text-sm font-medium text-slate-700 mb-2 text-center">2026年2月</div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((d) => (
          <div key={d} className="text-slate-500 font-medium py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const isTarget = day >= startDay && day <= endDay
          return (
            <div
              key={day}
              className={`py-1 rounded ${
                isTarget
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-700"
              }`}
            >
              {day}
            </div>
          )
        })}
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
  const [comment, setComment] = useState("")

  if (!request) return null

  const afterApprovalRemaining = request.remainingDays - request.days

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">{request.workerName}</SheetTitle>
            <LeaveTypeBadge type={request.leaveType} />
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            {request.workerNo} - {request.leaveType === "有給" ? "有給休暇" : "欠勤"}申請
          </SheetDescription>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前の申請
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次の申請
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Section 1: 申請情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              申請情報
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">作業員名</span>
                <p className="font-medium text-slate-900">{request.workerName}（{request.workerNo}）</p>
              </div>
              <div>
                <span className="text-slate-500">休暇種別</span>
                <p className="mt-0.5"><LeaveTypeBadge type={request.leaveType} /></p>
              </div>
              <div>
                <span className="text-slate-500">対象期間</span>
                <p className="font-medium text-slate-900">
                  {request.startDate} {request.startDate !== request.endDate && `〜 ${request.endDate}`}
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
              <div>
                <span className="text-slate-500">申請日</span>
                <p className="font-medium text-slate-900">{request.submittedAt}</p>
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
                        <td className="px-3 py-2 text-slate-500 bg-slate-50">年間付与日数</td>
                        <td className="px-3 py-2 text-slate-900 font-medium tabular-nums">{request.annualAllowance}日</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 text-slate-500 bg-slate-50">使用済み</td>
                        <td className="px-3 py-2 text-slate-900 font-medium tabular-nums">{request.usedDays}日</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 text-slate-500 bg-slate-50">今回申請分</td>
                        <td className="px-3 py-2 text-slate-900 font-medium tabular-nums">{request.days}日</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-600 bg-slate-50 font-semibold">承認後の残日数</td>
                        <td className={`px-3 py-2 font-bold tabular-nums ${afterApprovalRemaining <= 2 ? "text-red-600" : "text-slate-900"}`}>
                          {afterApprovalRemaining}日
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="mb-6" />
            </>
          )}

          {/* Section 3: 勤務カレンダー */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              勤務カレンダー（当月）
            </h3>
            <MiniCalendar targetStart={request.startDate} targetEnd={request.endDate} />
          </div>

          <Separator className="mb-6" />

          {/* Comment */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              承認コメント
            </h3>
            {request.comment && (
              <div className="mb-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-sm text-slate-700">{request.comment}</p>
              </div>
            )}
            {request.status === "承認待ち" && (
              <Textarea
                placeholder="却下時の理由や承認時のメモを入力..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            )}
          </div>

          {/* Data link note */}
          <div className="flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              承認すると、勤務状況カレンダーに反映されます
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          {request.status === "承認待ち" && (
            <>
              <Button
                onClick={() => onApprove(request.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                承認
              </Button>
              <Button
                variant="outline"
                onClick={() => onReject(request.id)}
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
