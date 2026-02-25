"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { ExpenseRequest, ApprovalStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">承認待ち</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">承認済み</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">却下</Badge>
}

function formatYen(amount: number) {
  return `¥${amount.toLocaleString()}`
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
            <SheetTitle className="text-lg text-slate-900">
              {request.workerName}
            </SheetTitle>
            <StatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            経費申請 - {request.requestedAt}
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
                <span className="text-slate-500">利用日</span>
                <p className="font-medium text-slate-900">{request.expenseDate}</p>
              </div>
              <div>
                <span className="text-slate-500">内容</span>
                <p className="font-medium text-slate-900">{request.description}</p>
              </div>
              <div>
                <span className="text-slate-500">金額</span>
                <p className="font-medium text-slate-900 font-mono tabular-nums">{formatYen(request.amount)}</p>
              </div>
              {request.orderNumber && (
                <div>
                  <span className="text-slate-500">関連案件</span>
                  <p className="font-medium text-slate-900 font-mono">{request.orderNumber}</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: レシート写真 */}
          {request.hasReceipt && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  レシート写真
                </h3>
                <div className="w-full aspect-[3/4] max-w-[300px] rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="h-12 w-12 mb-1" />
                  <span className="text-xs text-slate-500">receipt.jpeg</span>
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
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントがあれば記入..."
              className="min-h-[80px] border-slate-300 text-sm"
            />
          </div>

          {/* Data integration note */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
            給与計算に反映されます
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
