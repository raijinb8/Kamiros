"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
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
import type { OtherRequest, RequestStatus, OtherRequestType } from "@/lib/request-data"

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "承認待ち") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">{status}</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">{status}</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">{status}</Badge>
}

function RequestTypeBadge({ type }: { type: OtherRequestType }) {
  if (type === "住所変更") {
    return <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">{type}</Badge>
  }
  if (type === "口座変更") {
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">{type}</Badge>
  }
  return <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">{type}</Badge>
}

interface OtherDetailPanelProps {
  request: OtherRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function OtherDetailPanel({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: OtherDetailPanelProps) {
  const [comment, setComment] = useState("")

  if (!request) return null

  const hasChangeDetails = request.changeDetails && Object.keys(request.changeDetails.before).length > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">{request.workerName}</SheetTitle>
            <RequestTypeBadge type={request.requestType} />
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            {request.workerNo} - {request.requestType}申請
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
                <span className="text-slate-500">申請種別</span>
                <p className="mt-0.5"><RequestTypeBadge type={request.requestType} /></p>
              </div>
              <div>
                <span className="text-slate-500">申請日</span>
                <p className="font-medium text-slate-900">{request.submittedAt}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">内容</span>
                <p className="font-medium text-slate-900">{request.summary}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 変更内容 */}
          {hasChangeDetails && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  変更内容
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/4">項目</th>
                        <th className="text-left px-3 py-2 font-medium text-slate-600 w-5/16">変更前</th>
                        <th className="w-6 px-1"></th>
                        <th className="text-left px-3 py-2 font-medium text-slate-600 w-5/16">変更後</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(request.changeDetails!.before).map((key) => (
                        <tr key={key} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-slate-500">{key}</td>
                          <td className="px-3 py-2 text-slate-700">{request.changeDetails!.before[key]}</td>
                          <td className="px-1 text-slate-400">
                            <ArrowRight className="h-3 w-3" />
                          </td>
                          <td className="px-3 py-2 text-blue-700 font-medium">{request.changeDetails!.after[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="mb-6" />
            </>
          )}

          {/* Section 3: 承認コメント */}
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
              承認すると、作業員マスタに反映されます
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
                承認（マスタデータに反映）
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
