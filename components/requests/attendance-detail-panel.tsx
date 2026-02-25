"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  AlertTriangle,
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
import type { AttendanceRequest, RequestStatus, StampType } from "@/lib/request-data"

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "承認待ち") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">
        {status}
      </Badge>
    )
  }
  if (status === "承認済み") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">
        {status}
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">
      {status}
    </Badge>
  )
}

function StampTypeBadge({ type }: { type: StampType }) {
  if (type === "到着") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">
        {type}
      </Badge>
    )
  }
  return (
    <Badge className="bg-violet-100 text-violet-700 border-violet-200" variant="outline">
      {type}
    </Badge>
  )
}

function formatDiff(minutes: number): string {
  if (minutes === 0) return "\u00B10\u5206"
  return minutes > 0 ? `+${minutes}\u5206` : `${minutes}\u5206`
}

interface AttendanceDetailPanelProps {
  request: AttendanceRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function AttendanceDetailPanel({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: AttendanceDetailPanelProps) {
  const [comment, setComment] = useState("")

  if (!request) return null

  const isHighDiff = Math.abs(request.diffMinutes) >= 15

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">{request.workerName}</SheetTitle>
            <StampTypeBadge type={request.stampType} />
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            {request.workerNo} - {request.siteName}
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
          {/* Section 1: 打刻情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              打刻情報
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">作業員</span>
                <p className="font-medium text-slate-900">
                  {request.workerName}（{request.workerNo}）
                </p>
              </div>
              <div>
                <span className="text-slate-500">種別</span>
                <p className="mt-0.5">
                  <StampTypeBadge type={request.stampType} />
                </p>
              </div>
              <div>
                <span className="text-slate-500">打刻時刻</span>
                <p className="font-medium text-slate-900 font-mono tabular-nums">
                  {request.stampTime}
                </p>
              </div>
              <div>
                <span className="text-slate-500">申請日時</span>
                <p className="font-medium text-slate-900">{request.submittedAt}</p>
              </div>
              <div>
                <span className="text-slate-500">対象日</span>
                <p className="font-medium text-slate-900">{request.targetDate}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 案件情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              案件情報
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">手配番号</span>
                <p className="font-medium text-slate-900 font-mono">{request.orderNumber}</p>
              </div>
              <div>
                <span className="text-slate-500">顧客名</span>
                <p className="font-medium text-slate-900">{request.clientName}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">現場名</span>
                <p className="font-medium text-slate-900">{request.siteName}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">現場住所</span>
                <p className="font-medium text-slate-900">{request.siteAddress}</p>
              </div>
              <div>
                <span className="text-slate-500">予定時刻</span>
                <p className="font-medium text-slate-900">{request.scheduledRange}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 3: 予定 vs 打刻 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              予定 vs 打刻
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">項目</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">予定</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">打刻</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">
                      {request.stampType === "到着" ? "到着時刻" : "退勤時刻"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 font-mono tabular-nums">
                      {request.scheduledTime}
                    </td>
                    <td className={`px-3 py-2 font-mono tabular-nums ${isHighDiff ? "text-red-600 font-semibold" : "text-slate-700"}`}>
                      {request.stampTime}
                      {request.diffMinutes !== 0 && (
                        <span className={`ml-1 text-xs ${isHighDiff ? "text-red-600" : "text-slate-500"}`}>
                          （{formatDiff(request.diffMinutes)}）
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isHighDiff && (
              <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  予定時刻との差異が15分以上あります。確認の上、承認してください。
                </p>
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Section 4: GPS情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              GPS情報
            </h3>
            {request.hasGps ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">打刻位置の地図</p>
                    <p className="text-xs text-slate-500 mt-1">現場から約50m</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">GPS情報なし</p>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Section 5: 承認コメント */}
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
              承認すると、勤怠データに反映されます
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
          <Button
            variant="link"
            className="text-slate-500 hover:text-slate-700 ml-auto h-auto p-0"
          >
            案件データを開く
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
