"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { AdvanceRequest, ApprovalStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">未処理</Badge>
  }
  if (status === "承認済み") {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">承認済み</Badge>
  }
  return <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">却下</Badge>
}

function formatYen(amount: number) {
  return `¥${amount.toLocaleString()}`
}

interface AdvanceDetailPanelProps {
  request: AdvanceRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string, amount: number) => void
  onReject: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function AdvanceDetailPanel({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: AdvanceDetailPanelProps) {
  const [confirmedAmount, setConfirmedAmount] = useState(0)

  useEffect(() => {
    if (request) {
      if (request.type === "MAX") {
        setConfirmedAmount(request.detail.availableAdvance)
      } else {
        setConfirmedAmount(request.requestedAmount ?? 0)
      }
    }
  }, [request])

  if (!request) return null

  const { detail, history } = request

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
            内金申請 - {request.requestedAt}
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
                <span className="text-slate-500">申請日時</span>
                <p className="font-medium text-slate-900">{request.requestedAt}</p>
              </div>
              <div>
                <span className="text-slate-500">申請種別</span>
                <p className="font-medium text-slate-900">{request.type}</p>
              </div>
              <div>
                <span className="text-slate-500">申請金額</span>
                <p className="font-medium text-slate-900">
                  {request.requestedAmount !== null ? formatYen(request.requestedAmount) : "MAX"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 内金計算 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              内金計算
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2.5 text-slate-500">当月稼働日当（暫定）</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {formatYen(detail.monthlyDailyWage)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2.5 text-slate-500">当月交通費（暫定）</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700">
                      {formatYen(detail.monthlyTransport)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <td className="px-3 py-2.5 text-slate-600 font-medium">暫定支給合計</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-900 font-medium">
                      {formatYen(detail.grossPay)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2.5 text-slate-500">− 見込み控除（所得税等）</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-red-600">
                      −{formatYen(detail.estimatedDeduction)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2.5 text-slate-500">− 当月内金済み額</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-red-600">
                      −{formatYen(detail.alreadyAdvanced)}
                    </td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="px-3 py-3 text-blue-800 font-semibold">内金可能額（目安）</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums text-blue-800 font-bold text-base">
                      {formatYen(detail.availableAdvance)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-start gap-1">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              月途中の暫定値です。最終的な給与確定額とは異なる場合があります。
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Section 3: 確定金額入力 */}
          {request.status === "未処理" && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  確定金額の入力
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">¥</span>
                  <Input
                    type="number"
                    value={confirmedAmount}
                    onChange={(e) => setConfirmedAmount(Number(e.target.value))}
                    className="max-w-[200px] font-mono tabular-nums text-right border-slate-300"
                  />
                </div>
              </div>
              <Separator className="mb-6" />
            </>
          )}

          {/* Section 4: 内金履歴（当月） */}
          {history.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                内金履歴（当月）
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 font-medium text-slate-600">日付</th>
                      <th className="text-left px-3 py-2 font-medium text-slate-600">申請種別</th>
                      <th className="text-right px-3 py-2 font-medium text-slate-600">確定金額</th>
                      <th className="text-left px-3 py-2 font-medium text-slate-600">ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-600 font-mono tabular-nums text-xs">{h.date}</td>
                        <td className="px-3 py-2 text-slate-700">{h.type}</td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-700">
                          {h.confirmedAmount !== null ? formatYen(h.confirmedAmount) : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={h.status} />
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-700" colSpan={2}>当月累計</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatYen(request.monthlyTotal)}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Data integration note */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
            給与計算の前払金控除に反映されます
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          {request.status === "未処理" && (
            <>
              <Button
                onClick={() => {
                  onApprove(request.id, confirmedAmount)
                  onOpenChange(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                承認（{formatYen(confirmedAmount)} を内金として処理）
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
