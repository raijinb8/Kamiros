"use client"

import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
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
import type { OtherRequest, ApprovalStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">承認待ち</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">承認済み</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">却下</Badge>
}

function RequestTypeBadge({ type }: { type: string }) {
  if (type === "住所変更") {
    return <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">住所変更</Badge>
  }
  if (type === "口座変更") {
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">口座変更</Badge>
  }
  return <Badge className="bg-slate-100 text-slate-600 border-slate-200" variant="outline">その他</Badge>
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
  if (!request) return null

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
            {request.requestType} - {request.requestedAt}
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
                <span className="text-slate-500">申請日</span>
                <p className="font-medium text-slate-900">{request.requestedAt}</p>
              </div>
              <div>
                <span className="text-slate-500">申請種別</span>
                <div className="mt-0.5"><RequestTypeBadge type={request.requestType} /></div>
              </div>
              <div>
                <span className="text-slate-500">内容</span>
                <p className="font-medium text-slate-900">{request.summary}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 変更前→変更後 */}
          {request.changes && request.changes.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  変更内容
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-3 py-2 font-medium text-slate-600">項目</th>
                        <th className="text-left px-3 py-2 font-medium text-slate-600">変更前</th>
                        <th className="w-6" />
                        <th className="text-left px-3 py-2 font-medium text-slate-600">変更後</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.changes.map((change, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2.5 text-slate-500 font-medium">{change.field}</td>
                          <td className="px-3 py-2.5 text-slate-600">{change.before}</td>
                          <td className="text-center text-slate-300">
                            <ArrowRight className="h-3.5 w-3.5 inline-block" />
                          </td>
                          <td className="px-3 py-2.5 text-slate-900 font-medium">{change.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Separator className="mb-6" />
            </>
          )}

          {/* Data integration note */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
            {request.requestType === "住所変更" || request.requestType === "口座変更"
              ? "作業員マスタに反映されます"
              : "申請内容に基づき対応します"}
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
                承認（マスタデータに反映）
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
