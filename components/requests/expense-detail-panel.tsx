"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ImageIcon,
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
import type { ExpenseRequest, RequestStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "承認待ち") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">{status}</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">{status}</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">{status}</Badge>
}

function formatCurrency(amount: number): string {
  return `\u00A5${amount.toLocaleString()}`
}

interface ExpenseDetailPanelProps {
  request: ExpenseRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function ExpenseDetailPanel({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ExpenseDetailPanelProps) {
  const [comment, setComment] = useState("")

  if (!request) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">{request.workerName}</SheetTitle>
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            {request.workerNo} - 経費申請
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
                <span className="text-slate-500">利用日</span>
                <p className="font-medium text-slate-900">{request.expenseDate}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">内容</span>
                <p className="font-medium text-slate-900">{request.description}</p>
              </div>
              <div>
                <span className="text-slate-500">金額</span>
                <p className="font-bold text-slate-900 text-lg tabular-nums">{formatCurrency(request.amount)}</p>
              </div>
              {request.orderNumber && (
                <div>
                  <span className="text-slate-500">関連案件</span>
                  <p className="font-medium text-slate-900 font-mono">{request.orderNumber}</p>
                </div>
              )}
              <div>
                <span className="text-slate-500">申請日</span>
                <p className="font-medium text-slate-900">{request.submittedAt}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: レシート画像 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              レシート画像
            </h3>
            {request.hasReceipt ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">レシート画像</p>
                    <p className="text-xs text-slate-400 mt-1">クリックで拡大表示</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">レシート添付なし</p>
            )}
          </div>

          <Separator className="mb-6" />

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
              承認すると、給与計算に反映されます
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
