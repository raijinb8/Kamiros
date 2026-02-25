"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Banknote,
  TrendingUp,
  TrendingDown,
  Search,
  RotateCcw,
  Download,
  Check,
  ArrowRight,
  FileText,
  RefreshCw,
  ShieldCheck,
  Undo2,
  MinusCircle,
} from "lucide-react"
import { toast } from "sonner"
import type { PayrollWorker, PayrollStatus, WorkflowStep } from "@/lib/payroll-data"
import { payrollWorkers as initialData, formatPayrollJPY } from "@/lib/payroll-data"
import { PayrollDetailPanel } from "./payroll-detail-panel"

type ColumnGroup = "all" | "pay" | "deduction"

function StatusBadge({ status }: { status: PayrollStatus }) {
  const styles: Record<PayrollStatus, string> = {
    "未集計": "bg-slate-100 text-slate-600 border-slate-300",
    "集計済み・未承認": "bg-orange-100 text-orange-700 border-orange-200",
    "社長承認待ち": "bg-amber-100 text-amber-700 border-amber-200",
    "承認済み・確定": "bg-emerald-100 text-emerald-700 border-emerald-200",
  }
  return (
    <Badge className={`${styles[status]} text-xs`} variant="outline">
      {status}
    </Badge>
  )
}

function WorkflowStepper({ currentStep }: { currentStep: WorkflowStep }) {
  const steps = [
    { num: 1, label: "集計完了" },
    { num: 2, label: "事務員確認中" },
    { num: 3, label: "社長承認待ち" },
    { num: 4, label: "確定・振込CSV生成" },
  ]

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isDone = step.num < currentStep
        const isActive = step.num === currentStep
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : step.num}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isDone
                    ? "text-emerald-600 font-medium"
                    : isActive
                      ? "text-blue-700 font-semibold"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className={`h-4 w-4 mx-3 shrink-0 ${isDone ? "text-emerald-400" : "text-slate-300"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function InlineEditCell({
  value,
  fieldKey,
  workerId,
  isEdited,
  disabled,
  onSave,
}: {
  value: number
  fieldKey: string
  workerId: string
  isEdited: boolean
  disabled: boolean
  onSave: (workerId: string, field: string, value: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleSave = useCallback(() => {
    const num = parseInt(editValue.replace(/,/g, ""), 10)
    if (!isNaN(num)) {
      onSave(workerId, fieldKey, num)
    }
    setEditing(false)
  }, [editValue, onSave, workerId, fieldKey])

  if (disabled) {
    return (
      <span className="font-mono tabular-nums text-sm text-slate-700 text-right block">
        {formatPayrollJPY(value)}
      </span>
    )
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave()
          if (e.key === "Escape") setEditing(false)
        }}
        className="w-full h-7 px-1.5 text-sm font-mono tabular-nums text-right border border-blue-400 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    )
  }

  return (
    <button
      onClick={() => {
        setEditValue(value.toString())
        setEditing(true)
      }}
      className={`w-full text-right font-mono tabular-nums text-sm cursor-pointer hover:bg-blue-50 rounded px-1 py-0.5 transition-colors ${
        isEdited ? "bg-amber-50 text-slate-900" : "text-slate-700"
      }`}
    >
      {formatPayrollJPY(value)}
    </button>
  )
}

export function PayrollCalculationTab() {
  const [workers, setWorkers] = useState<PayrollWorker[]>(
    initialData.map((w) => ({ ...w, editedFields: new Set(w.editedFields) }))
  )
  const [isAggregated, setIsAggregated] = useState(false)
  const [payrollMonth, setPayrollMonth] = useState("2026-02")
  const [status, setStatus] = useState<PayrollStatus>("未集計")
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(1)
  const [columnGroup, setColumnGroup] = useState<ColumnGroup>("all")

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const selectedWorker = selectedIndex >= 0 ? workers[selectedIndex] : null

  // KPI calculations
  const kpis = useMemo(() => {
    const workerCount = workers.length
    const payTotal = workers.reduce((s, w) => s + w.payTotal, 0)
    const deductionTotal = workers.reduce((s, w) => s + w.deductionTotal, 0)
    const netTotal = workers.reduce((s, w) => s + w.netPay, 0)
    const prevMonthNet = 3322200 // Previous month reference
    const change = ((netTotal - prevMonthNet) / prevMonthNet) * 100
    return { workerCount, payTotal, deductionTotal, netTotal, change }
  }, [workers])

  // Table totals
  const totals = useMemo(() => {
    return workers.reduce(
      (acc, w) => ({
        workDays: acc.workDays + w.workDays,
        hours: acc.hours + w.hours,
        basePay: acc.basePay + w.basePay,
        overtime: acc.overtime + w.overtime,
        transport: acc.transport + w.transport,
        payTotal: acc.payTotal + w.payTotal,
        incomeTax: acc.incomeTax + w.incomeTax,
        socialInsurance: acc.socialInsurance + w.socialInsurance,
        residentTax: acc.residentTax + w.residentTax,
        advance: acc.advance + w.advance,
        otherDeduction: acc.otherDeduction + w.otherDeduction,
        deductionTotal: acc.deductionTotal + w.deductionTotal,
        netPay: acc.netPay + w.netPay,
      }),
      {
        workDays: 0, hours: 0, basePay: 0, overtime: 0, transport: 0, payTotal: 0,
        incomeTax: 0, socialInsurance: 0, residentTax: 0, advance: 0, otherDeduction: 0,
        deductionTotal: 0, netPay: 0,
      }
    )
  }, [workers])

  const handleAggregate = useCallback(() => {
    setIsAggregated(true)
    setStatus("集計済み・未承認")
    setWorkflowStep(2)
    toast.success("給与集計を実行しました")
  }, [])

  const handleClear = useCallback(() => {
    setIsAggregated(false)
    setStatus("未集計")
    setWorkflowStep(1)
    setPayrollMonth("2026-02")
    setWorkers(initialData.map((w) => ({ ...w, editedFields: new Set() })))
  }, [])

  const handleInlineEdit = useCallback((workerId: string, field: string, value: number) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w
        const updated = { ...w, editedFields: new Set(w.editedFields) }
        updated.editedFields.add(field)
        ;(updated as Record<string, unknown>)[field] = value

        // Recalculate totals
        updated.payTotal = updated.basePay + updated.overtime + updated.transport
        updated.deductionTotal =
          updated.incomeTax + updated.socialInsurance + updated.residentTax + updated.advance + updated.otherDeduction
        updated.netPay = updated.payTotal - updated.deductionTotal
        return updated
      })
    )
  }, [])

  const handleSubmitForApproval = useCallback(() => {
    setStatus("社長承認待ち")
    setWorkflowStep(3)
    toast.success("社長承認へ提出しました")
  }, [])

  const handleApprove = useCallback(() => {
    setStatus("承認済み・確定")
    setWorkflowStep(4)
    toast.success("給与を承認・確定しました")
  }, [])

  const handleReject = useCallback(() => {
    setStatus("集計済み・未承認")
    setWorkflowStep(2)
    toast.info("差し戻しました")
  }, [])

  const openDetail = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  const showPay = columnGroup === "all" || columnGroup === "pay"
  const showDeduction = columnGroup === "all" || columnGroup === "deduction"
  const isEditable = status === "集計済み・未承認"

  return (
    <div className="space-y-4 min-w-0">
      {/* Filter area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">処理年月</label>
              <Select value={payrollMonth} onValueChange={setPayrollMonth}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-12">2025年12月</SelectItem>
                  <SelectItem value="2026-01">2026年1月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAggregate}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Search className="h-4 w-4 mr-1.5" />
                集計実行
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="h-9 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                クリア
              </Button>
            </div>

            <div className="ml-auto">
              <StatusBadge status={status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {isAggregated && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">対象作業員数</CardTitle>
                <Users className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {kpis.workerCount}
                  <span className="text-base font-normal text-slate-500 ml-1">名</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">支給総額</CardTitle>
                <Banknote className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums sm:text-xl xl:text-2xl">
                  {formatPayrollJPY(kpis.payTotal)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">控除総額</CardTitle>
                <MinusCircle className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums sm:text-xl xl:text-2xl">
                  {formatPayrollJPY(kpis.deductionTotal)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">差引支給総額</CardTitle>
                <Banknote className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-700 font-mono tabular-nums sm:text-xl xl:text-2xl">
                  {formatPayrollJPY(kpis.netTotal)}
                </div>
              </CardContent>
            </Card>

            <Card className={kpis.change >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-sm font-medium ${kpis.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  前月比
                </CardTitle>
                {kpis.change >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold font-mono tabular-nums ${kpis.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {kpis.change >= 0 ? "+" : ""}
                  {kpis.change.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table action bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setColumnGroup("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  columnGroup === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                全項目を表示
              </button>
              <button
                onClick={() => setColumnGroup("pay")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  columnGroup === "pay"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                支給項目を表示
              </button>
              <button
                onClick={() => setColumnGroup("deduction")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  columnGroup === "deduction"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                控除項目を表示
              </button>
            </div>
            <Button variant="outline" className="h-8 text-xs border-slate-300 text-slate-700">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Excel出力
            </Button>
          </div>

          {/* Main payroll table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table className="min-w-[1400px]">
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow className="hover:bg-slate-50">
                    {/* Fixed columns */}
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-16 sticky left-0 bg-slate-50 z-20">
                      作業員No
                    </TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-28 sticky left-16 bg-slate-50 z-20 border-r border-slate-200">
                      氏名
                    </TableHead>
                    {/* Pay group */}
                    {showPay && (
                      <>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">稼働日数</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">時間</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[110px] px-3">基本給</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">時間外</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">交通費</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3 bg-slate-100">支給計</TableHead>
                      </>
                    )}
                    {/* Deduction group */}
                    {showDeduction && (
                      <>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">所得税</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">社会保険</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">住民税</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">前払金</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px] px-3">その他控除</TableHead>
                        <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3 bg-slate-100">控除計</TableHead>
                      </>
                    )}
                    {/* Net pay */}
                    <TableHead className="text-slate-600 text-xs font-bold text-right whitespace-nowrap min-w-[130px] px-3 bg-blue-50">
                      差引支給額
                    </TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-14">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((w, index) => (
                    <TableRow
                      key={w.id}
                      className="cursor-pointer transition-colors hover:bg-slate-50/80"
                      onClick={() => openDetail(index)}
                    >
                      {/* Fixed columns */}
                      <TableCell className="font-mono text-sm text-slate-700 tabular-nums sticky left-0 bg-white z-10">
                        {w.workerNo}
                      </TableCell>
                      <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap sticky left-16 bg-white z-10 border-r border-slate-200">
                        {w.name}
                      </TableCell>
                      {/* Pay group */}
                      {showPay && (
                        <>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">
                            {w.workDays}日
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">
                            {w.hours.toFixed(1)}h
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                            {formatPayrollJPY(w.basePay)}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap px-3" onClick={(e) => e.stopPropagation()}>
                            <InlineEditCell
                              value={w.overtime}
                              fieldKey="overtime"
                              workerId={w.id}
                              isEdited={w.editedFields.has("overtime")}
                              disabled={!isEditable}
                              onSave={handleInlineEdit}
                            />
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                            {formatPayrollJPY(w.transport)}
                          </TableCell>
                          <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium whitespace-nowrap px-3 bg-slate-50/50">
                            {formatPayrollJPY(w.payTotal)}
                          </TableCell>
                        </>
                      )}
                      {/* Deduction group */}
                      {showDeduction && (
                        <>
                          <TableCell className="text-right whitespace-nowrap px-3" onClick={(e) => e.stopPropagation()}>
                            <InlineEditCell
                              value={w.incomeTax}
                              fieldKey="incomeTax"
                              workerId={w.id}
                              isEdited={w.editedFields.has("incomeTax")}
                              disabled={!isEditable}
                              onSave={handleInlineEdit}
                            />
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                            {formatPayrollJPY(w.socialInsurance)}
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                            {formatPayrollJPY(w.residentTax)}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap px-3" onClick={(e) => e.stopPropagation()}>
                            <InlineEditCell
                              value={w.advance}
                              fieldKey="advance"
                              workerId={w.id}
                              isEdited={w.editedFields.has("advance")}
                              disabled={!isEditable}
                              onSave={handleInlineEdit}
                            />
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap px-3" onClick={(e) => e.stopPropagation()}>
                            <InlineEditCell
                              value={w.otherDeduction}
                              fieldKey="otherDeduction"
                              workerId={w.id}
                              isEdited={w.editedFields.has("otherDeduction")}
                              disabled={!isEditable}
                              onSave={handleInlineEdit}
                            />
                          </TableCell>
                          <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium whitespace-nowrap px-3 bg-slate-50/50">
                            {formatPayrollJPY(w.deductionTotal)}
                          </TableCell>
                        </>
                      )}
                      {/* Net pay */}
                      <TableCell className="text-sm text-blue-800 text-right font-mono tabular-nums font-bold whitespace-nowrap px-3 bg-blue-50/40">
                        {formatPayrollJPY(w.netPay)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={() => openDetail(index)}
                        >
                          詳細
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total row */}
                  <TableRow className="bg-slate-100 border-t-2 border-slate-300 hover:bg-slate-100 font-bold">
                    <TableCell className="sticky left-0 bg-slate-100 z-10" />
                    <TableCell className="text-sm text-slate-900 sticky left-16 bg-slate-100 z-10 border-r border-slate-200">
                      合計
                    </TableCell>
                    {showPay && (
                      <>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums">{totals.workDays}日</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums">{totals.hours.toFixed(1)}h</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.basePay)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.overtime)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.transport)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3 bg-slate-100">{formatPayrollJPY(totals.payTotal)}</TableCell>
                      </>
                    )}
                    {showDeduction && (
                      <>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.incomeTax)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.socialInsurance)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.residentTax)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.advance)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatPayrollJPY(totals.otherDeduction)}</TableCell>
                        <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3 bg-slate-100">{formatPayrollJPY(totals.deductionTotal)}</TableCell>
                      </>
                    )}
                    <TableCell className="text-sm text-blue-800 text-right font-mono tabular-nums font-bold whitespace-nowrap px-3 bg-blue-100/60">
                      {formatPayrollJPY(totals.netPay)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500">{workers.length}名 表示中</span>
              {isEditable && (
                <span className="text-xs text-amber-600">
                  黄色背景のセルは手動修正済みです
                </span>
              )}
            </div>
          </div>

          {/* Workflow action area */}
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-5 pb-5">
              <div className="flex flex-col gap-4">
                <WorkflowStepper currentStep={workflowStep} />

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  {status === "集計済み・未承認" && (
                    <>
                      <Button
                        onClick={handleSubmitForApproval}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                        確認完了 → 社長承認へ提出
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleAggregate}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        再集計
                      </Button>
                    </>
                  )}

                  {status === "社長承認待ち" && (
                    <>
                      <Button
                        onClick={handleApprove}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                        承認して確定
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <Undo2 className="h-4 w-4 mr-1.5" />
                        差し戻し
                      </Button>
                    </>
                  )}

                  {status === "承認済み・確定" && (
                    <>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="h-4 w-4 mr-1.5" />
                        全銀協CSV出力
                      </Button>
                      <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                        <FileText className="h-4 w-4 mr-1.5" />
                        給与明細PDF一括出力
                      </Button>
                      <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                        <FileText className="h-4 w-4 mr-1.5" />
                        給与一覧表PDF出力
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state before aggregation */}
      {!isAggregated && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              処理年月を選択し、「集計実行」ボタンを押してください。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Panel */}
      <PayrollDetailPanel
        worker={selectedWorker}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(workers.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < workers.length - 1}
      />
    </div>
  )
}
