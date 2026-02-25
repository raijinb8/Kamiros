"use client"

import { ChevronLeft, ChevronRight, FileText, FileSpreadsheet } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PayrollWorker } from "@/lib/payroll-data"
import { workerDetails, formatPayrollJPY } from "@/lib/payroll-data"

interface PayrollDetailPanelProps {
  worker: PayrollWorker | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function PayrollDetailPanel({
  worker,
  open,
  onOpenChange,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PayrollDetailPanelProps) {
  if (!worker) return null

  const detail = workerDetails[worker.workerNo]

  // Fallback values for workers without full detail data
  const assignments = detail?.assignments || []
  const payBreakdown = detail?.payBreakdown || {
    basePay: worker.basePay,
    basePayNote: `${worker.workDays}日分`,
    overtime: worker.overtime,
    overtimeNote: worker.overtime > 0 ? "手動入力" : "",
    transport: worker.transport,
    transportNote: "自動集計",
    payTotal: worker.payTotal,
  }
  const deductionBreakdown = detail?.deductionBreakdown || {
    incomeTax: worker.incomeTax,
    incomeTaxNote: "税率表より自動計算",
    socialInsurance: worker.socialInsurance,
    socialInsuranceNote: "",
    residentTax: worker.residentTax,
    residentTaxNote: "",
    advance: worker.advance,
    advanceNote: "",
    otherDeduction: worker.otherDeduction,
    otherDeductionNote: "",
    deductionTotal: worker.deductionTotal,
  }

  const totalAssignmentHours = assignments.reduce((s, a) => s + a.hours, 0)
  const totalAssignmentTransport = assignments.reduce((s, a) => s + a.transport, 0)
  const totalAssignmentPay = assignments.reduce((s, a) => s + a.dailyPay, 0)

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
              No.{worker.workerNo} {worker.name}
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm text-slate-500">
            作業員No: {worker.workerNo}
            {detail && ` / ${detail.employeeType} / 最寄り駅: ${detail.nearestStation}`}
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
              前の作業員
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次の作業員
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Section 1: Worker info */}
          {detail && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                作業員情報
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-slate-500">作業員No</span>
                  <p className="font-medium text-slate-900">{detail.workerNo}</p>
                </div>
                <div>
                  <span className="text-slate-500">氏名</span>
                  <p className="font-medium text-slate-900">{detail.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">社員区分</span>
                  <p className="font-medium text-slate-900">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {detail.employeeType}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">最寄り駅</span>
                  <p className="font-medium text-slate-900">{detail.nearestStation}</p>
                </div>
              </div>
            </div>
          )}

          <Separator className="mb-6" />

          {/* Section 2: Assignment details */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              支給明細（日別案件リスト）
            </h3>
            {assignments.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="min-w-[750px]">
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-50">
                        <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">作業日</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">手配番号</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客名</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">現場名</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">時間</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[90px] px-3">単価</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[90px] px-3">交通費</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">日当</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((a, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/80">
                          <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{a.workDate}</TableCell>
                          <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{a.orderNumber}</TableCell>
                          <TableCell className="text-sm text-slate-900 whitespace-nowrap">{a.customerName}</TableCell>
                          <TableCell className="text-sm text-slate-700 whitespace-nowrap">{a.siteName}</TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">{a.hours.toFixed(1)}h</TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(a.unitPrice)}</TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(a.transport)}</TableCell>
                          <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium whitespace-nowrap px-3">{formatPayrollJPY(a.dailyPay)}</TableCell>
                        </TableRow>
                      ))}
                      {/* Totals row */}
                      <TableRow className="bg-slate-50 border-t-2 border-slate-300 hover:bg-slate-50">
                        <TableCell colSpan={4} className="text-sm font-bold text-slate-900">
                          合計
                        </TableCell>
                        <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums">
                          {totalAssignmentHours.toFixed(1)}h
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                          {formatPayrollJPY(totalAssignmentTransport)}
                        </TableCell>
                        <TableCell className="text-sm font-bold text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">
                          {formatPayrollJPY(totalAssignmentPay)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg p-8 text-center text-slate-400 text-sm">
                詳細な案件データは現在利用できません
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Section 3: Pay & Deduction Summary */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              支給・控除サマリー
            </h3>

            {/* Pay section */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-600 mb-2">支給</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">基本給</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(payBreakdown.basePay)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{payBreakdown.basePayNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">所定時間外賃金</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(payBreakdown.overtime)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{payBreakdown.overtimeNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">交通費</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(payBreakdown.transport)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{payBreakdown.transportNote}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="px-3 py-2 text-slate-900">支給計</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(payBreakdown.payTotal)}</td>
                      <td className="px-3 py-2" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deduction section */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-600 mb-2">控除</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">所得税</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.incomeTax)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{deductionBreakdown.incomeTaxNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">社会保険料</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.socialInsurance)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{deductionBreakdown.socialInsuranceNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">住民税</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.residentTax)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{deductionBreakdown.residentTaxNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">前払金</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.advance)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{deductionBreakdown.advanceNote}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-700">その他控除</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.otherDeduction)}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{deductionBreakdown.otherDeductionNote}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="px-3 py-2 text-slate-900">控除計</td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-900">{formatPayrollJPY(deductionBreakdown.deductionTotal)}</td>
                      <td className="px-3 py-2" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Net pay */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="font-bold text-blue-800">差引支給額</span>
              <span className="text-xl font-bold font-mono tabular-nums text-blue-800">
                {formatPayrollJPY(worker.netPay)}
              </span>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 4: Notes */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              備考
            </h3>
            <Textarea
              placeholder="備考を入力..."
              className="min-h-[80px] text-sm"
              defaultValue={detail?.notes || ""}
            />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <FileText className="h-4 w-4 mr-1.5" />
            給与明細PDFプレビュー
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            案件明細をExcel出力
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
