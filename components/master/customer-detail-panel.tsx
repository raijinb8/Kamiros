"use client"

import { ChevronLeft, ChevronRight, Pencil, X } from "lucide-react"
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
import type { Customer } from "@/lib/master-data"
import { formatJPY } from "@/lib/master-data"

interface CustomerDetailPanelProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (customer: Customer) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-slate-500 text-xs">{label}</span>
      <p className={`font-medium text-slate-900 text-sm ${mono ? "font-mono tabular-nums" : ""}`}>{value || "-"}</p>
    </div>
  )
}

export function CustomerDetailPanel({
  customer,
  open,
  onOpenChange,
  onEdit,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: CustomerDetailPanelProps) {
  if (!customer) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
        {/* Panel Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">{customer.name}</SheetTitle>
            {customer.status === "有効" ? (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">有効</Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-500 border-slate-300" variant="outline">無効</Badge>
            )}
          </div>
          <SheetDescription className="text-sm text-slate-500">
            得意先コード: {customer.code}
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
              前へ
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次へ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-slate-300"
                onClick={() => onEdit(customer)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                編集
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">基本情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="得意先コード" value={customer.code} mono />
              <InfoRow label="得意先名" value={customer.name} />
              <InfoRow label="ハウスメーカー" value={customer.housemaker} />
              <InfoRow label="郵便番号" value={customer.postalCode} mono />
              <div className="col-span-2">
                <InfoRow label="住所" value={customer.address} />
              </div>
              <InfoRow label="電話番号" value={customer.phone} mono />
              <InfoRow label="FAX番号" value={customer.fax} mono />
              <InfoRow label="メールアドレス" value={customer.email} />
              <InfoRow label="担当者名" value={customer.contactPerson} />
              <InfoRow label="取引開始日" value={customer.startDate} mono />
            </div>
          </div>

          <Separator />

          {/* Section 2: Sales Unit Price */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              売上単価
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-blue-600 font-medium">フル</span>
                  <p className="text-xl font-bold text-blue-800 font-mono tabular-nums">{formatJPY(customer.fullPrice)}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-600 font-medium">ハーフ</span>
                  <p className="text-xl font-bold text-blue-800 font-mono tabular-nums">{formatJPY(customer.halfPrice)}</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                この単価で得意先への請求額が計算されます。
              </p>
            </div>
          </div>

          <Separator />

          {/* Section 3: Billing Settings */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">請求設定</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="締め日" value={customer.closingDay} />
              <InfoRow label="支払サイト" value={customer.paymentSite} />
              <InfoRow label="消費税計算" value={customer.taxCalcMethod} />
              <InfoRow label="インボイス番号" value={customer.invoiceNumber} mono />
              <InfoRow label="請求書送付方法" value={customer.invoiceSendMethod} />
              <InfoRow label="請求書送付先" value={customer.invoiceSendTo || "-"} />
            </div>
          </div>

          <Separator />

          {/* Section 4: Trade Performance Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">取引実績サマリー</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-xs text-slate-500">今月の案件数</span>
                <p className="font-medium text-slate-900 text-sm">
                  <span className="text-blue-600 hover:underline cursor-pointer">{customer.monthlyProjects}件</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">今月の請求額（見込み）</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">
                  <span className="text-blue-600 hover:underline cursor-pointer">{formatJPY(customer.monthlyBillingEstimate)}</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">先月の請求額</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">{formatJPY(customer.lastMonthBilling)}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">取引累計（年間）</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">{formatJPY(customer.yearlyBillingTotal)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 5: Notes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">備考</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{customer.notes || "なし"}</p>
          </div>

          <Separator />

          {/* Section 6: Audit History */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">更新履歴</h3>
            <div className="space-y-3">
              {customer.history.map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-slate-400 font-mono tabular-nums whitespace-nowrap text-xs shrink-0 pt-0.5">
                    {entry.datetime}
                  </span>
                  <div>
                    <span className="text-slate-600 text-xs">{entry.operator}</span>
                    <p className="text-slate-900 text-sm">{entry.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
