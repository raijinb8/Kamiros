"use client"

import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BillingCustomer, BillingDetail, CustomerSummary } from "@/lib/billing-data"
import { billingDetails, customerSummaries, formatJPY } from "@/lib/billing-data"

function StatusBadge({ status }: { status: string }) {
  if (status === "未発行") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">
        {status}
      </Badge>
    )
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">
      {status}
    </Badge>
  )
}

interface BillingDetailPanelProps {
  customer: BillingCustomer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onIssue: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function BillingDetailPanel({
  customer,
  open,
  onOpenChange,
  onIssue,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: BillingDetailPanelProps) {
  if (!customer) return null

  const details: BillingDetail[] = billingDetails[customer.customerCode] || []
  const summary: CustomerSummary | undefined = customerSummaries[customer.customerCode]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 gap-0"
      >
        {/* Panel Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-lg text-slate-900">
              {customer.customerName}
            </SheetTitle>
            <StatusBadge status={customer.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            顧客CD: {customer.customerCode} / 締日: {customer.closingDay}
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
              前の顧客
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次の顧客
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Section 1: Summary */}
          {summary && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                請求サマリー
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-slate-500">顧客CD</span>
                  <p className="font-medium text-slate-900">{summary.customerCode}</p>
                </div>
                <div>
                  <span className="text-slate-500">締日</span>
                  <p className="font-medium text-slate-900">{summary.closingDay}</p>
                </div>
                <div>
                  <span className="text-slate-500">集計期間</span>
                  <p className="font-medium text-slate-900">{summary.aggregationPeriod}</p>
                </div>
                <div>
                  <span className="text-slate-500">回収サイクル</span>
                  <p className="font-medium text-slate-900">{summary.collectionCycle}</p>
                </div>
                <div>
                  <span className="text-slate-500">回収日</span>
                  <p className="font-medium text-slate-900">{summary.collectionDay}</p>
                </div>
                <div>
                  <span className="text-slate-500">売上税区分</span>
                  <p className="font-medium text-slate-900">{summary.taxCategory}</p>
                </div>
                <div>
                  <span className="text-slate-500">消費税端数処理</span>
                  <p className="font-medium text-slate-900">{summary.taxRounding}</p>
                </div>
              </div>
            </div>
          )}

          <Separator className="mb-6" />

          {/* Section 2: Line items */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              案件明細
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">作業日</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">手配番号</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">現場名</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">区分</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">人工</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">基本単価</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">基本金額</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">交通費</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">諸手当</TableHead>
                      <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">小計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.map((d, i) => (
                      <TableRow key={i} className="hover:bg-slate-50/80">
                        <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{d.workDate}</TableCell>
                        <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{d.orderNumber}</TableCell>
                        <TableCell className="text-sm text-slate-900 whitespace-nowrap">{d.siteName}</TableCell>
                        <TableCell className="text-sm text-slate-700 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              d.workType === "フル"
                                ? "bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                : "bg-slate-100 text-slate-600 border-slate-200 text-xs"
                            }
                          >
                            {d.workType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">{d.manDays.toFixed(1)}</TableCell>
                        <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(d.unitPrice)}</TableCell>
                        <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(d.baseAmount)}</TableCell>
                        <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(d.transportCost)}</TableCell>
                        <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(d.allowances)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium whitespace-nowrap px-3">{formatJPY(d.lineTotal)}</TableCell>
                      </TableRow>
                    ))}
                    {/* Totals row */}
                    <TableRow className="bg-slate-50 border-t-2 border-slate-300 hover:bg-slate-50">
                      <TableCell colSpan={4} className="text-sm font-bold text-slate-900">
                        合計
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums">
                        {customer.manDays.toFixed(1)}
                      </TableCell>
                      <TableCell />
                      <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                        {formatJPY(customer.baseAmount)}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                        {formatJPY(customer.transportCost)}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                        {formatJPY(customer.allowances)}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                        {formatJPY(customer.subtotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tax and total */}
            <div className="mt-4 flex justify-end">
              <div className="w-72 sm:w-80 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">小計</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap">{formatJPY(customer.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">消費税（10%）</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap">{formatJPY(customer.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-4 font-bold text-base">
                  <span className="text-slate-900 shrink-0">請求金額（税込）</span>
                  <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap">{formatJPY(customer.totalWithTax)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 3: Invoice preview placeholder */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              請求書プレビュー
            </h3>
            <Button
              variant="outline"
              className="w-full h-20 border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-5 w-5 mr-2" />
              請求書プレビューを表示
            </Button>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          {customer.status === "未発行" ? (
            <Button
              onClick={() => onIssue(customer.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              請求書を発行（PDF生成）
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-1.5" />
              PDFダウンロード
            </Button>
          )}
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            案件明細をExcel出力
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
