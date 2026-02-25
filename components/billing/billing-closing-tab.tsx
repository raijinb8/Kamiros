"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Building2, FileText, CheckCircle2, AlertCircle, RotateCcw, Search } from "lucide-react"
import { toast } from "sonner"
import type { BillingCustomer, BillingStatus } from "@/lib/billing-data"
import { billingCustomers as initialData, formatJPY } from "@/lib/billing-data"
import { BillingDetailPanel } from "./billing-detail-panel"

function StatusBadge({ status }: { status: BillingStatus }) {
  if (status === "未発行") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs" variant="outline">
        {status}
      </Badge>
    )
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" variant="outline">
      {status}
    </Badge>
  )
}

export function BillingClosingTab() {
  const [customers, setCustomers] = useState<BillingCustomer[]>(initialData)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isAggregated, setIsAggregated] = useState(false)

  // Filter state
  const [billingMonth, setBillingMonth] = useState("2026-02")
  const [closingDayFilter, setClosingDayFilter] = useState("all")

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const filteredCustomers = useMemo(() => {
    if (closingDayFilter === "all") return customers
    if (closingDayFilter === "20") return customers.filter((c) => c.closingDay === "20日")
    if (closingDayFilter === "end") return customers.filter((c) => c.closingDay === "末日")
    return customers
  }, [customers, closingDayFilter])

  const selectedCustomer = selectedIndex >= 0 ? filteredCustomers[selectedIndex] : null

  // Aggregation range display
  const aggregationRange = useMemo(() => {
    if (closingDayFilter === "20") return "2026/01/21 - 2026/02/20"
    if (closingDayFilter === "end") return "2026/02/01 - 2026/02/28"
    return "2026/01/21 - 2026/02/28"
  }, [closingDayFilter])

  // KPI calculations
  const kpis = useMemo(() => {
    const total = filteredCustomers.length
    const totalAmount = filteredCustomers.reduce((s, c) => s + c.subtotal, 0)
    const unissued = filteredCustomers.filter((c) => c.status === "未発行").length
    const issued = filteredCustomers.filter((c) => c.status === "発行済み").length
    return { total, totalAmount, unissued, issued }
  }, [filteredCustomers])

  // Selection
  const allSelected = filteredCustomers.length > 0 && selectedIds.size === filteredCustomers.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const unissuedSelectedCount = useMemo(
    () => filteredCustomers.filter((c) => selectedIds.has(c.id) && c.status === "未発行").length,
    [filteredCustomers, selectedIds]
  )

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCustomers.map((c) => c.id)))
    }
  }, [allSelected, filteredCustomers])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleAggregate = useCallback(() => {
    setIsAggregated(true)
    toast.success("集計を実行しました")
  }, [])

  const handleClear = useCallback(() => {
    setIsAggregated(false)
    setSelectedIds(new Set())
    setBillingMonth("2026-02")
    setClosingDayFilter("all")
  }, [])

  const handleIssue = useCallback(
    (id: string) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "発行済み" as BillingStatus } : c))
      )
      toast.success("請求書を発行しました")
    },
    []
  )

  const handleBulkIssue = useCallback(() => {
    setCustomers((prev) =>
      prev.map((c) =>
        selectedIds.has(c.id) && c.status === "未発行"
          ? { ...c, status: "発行済み" as BillingStatus }
          : c
      )
    )
    setSelectedIds(new Set())
    toast.success(`${unissuedSelectedCount}社の請求書を一括発行しました`)
  }, [selectedIds, unissuedSelectedCount])

  const openDetail = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  // Totals for the table footer
  const totals = useMemo(() => {
    return filteredCustomers.reduce(
      (acc, c) => ({
        projectCount: acc.projectCount + c.projectCount,
        manDays: acc.manDays + c.manDays,
        baseAmount: acc.baseAmount + c.baseAmount,
        transportCost: acc.transportCost + c.transportCost,
        allowances: acc.allowances + c.allowances,
        subtotal: acc.subtotal + c.subtotal,
        tax: acc.tax + c.tax,
        totalWithTax: acc.totalWithTax + c.totalWithTax,
      }),
      { projectCount: 0, manDays: 0, baseAmount: 0, transportCost: 0, allowances: 0, subtotal: 0, tax: 0, totalWithTax: 0 }
    )
  }, [filteredCustomers])

  return (
    <div className="space-y-4">
      {/* Filter area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">請求年月</label>
              <Select value={billingMonth} onValueChange={setBillingMonth}>
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">締日</label>
              <Select value={closingDayFilter} onValueChange={setClosingDayFilter}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全締日</SelectItem>
                  <SelectItem value="20">20日</SelectItem>
                  <SelectItem value="end">末日</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">集計範囲</label>
              <div className="h-9 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 font-mono tabular-nums">
                {aggregationRange}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
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
          </div>
        </CardContent>
      </Card>

      {isAggregated && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">対象顧客数</CardTitle>
                <Building2 className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {kpis.total}
                  <span className="text-base font-normal text-slate-500 ml-1">社</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">請求総額（税抜）</CardTitle>
                <FileText className="h-5 w-5 text-slate-500 shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                  {formatJPY(kpis.totalAmount)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">未発行</CardTitle>
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {kpis.unissued}
                  <span className="text-base font-normal text-orange-400 ml-1">社</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600">発行済み</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {kpis.issued}
                  <span className="text-base font-normal text-emerald-400 ml-1">社</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch action bar */}
          {unissuedSelectedCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-sm text-blue-800">
                選択した <strong>{unissuedSelectedCount}社</strong> の請求書を一括発行
              </span>
              <Button
                size="sm"
                onClick={handleBulkIssue}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
              >
                一括発行
              </Button>
            </div>
          )}

          {/* Customer billing table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table className="min-w-[1400px]">
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="w-10 px-3">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={toggleAll}
                        aria-label="全選択"
                      />
                    </TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客CD</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客名</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">締日</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">案件数</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">人工計</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">基本金額</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">交通費計</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">諸手当計</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[140px] px-3">請求金額（税抜）</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[120px] px-3">消費税</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[140px] px-3">請求金額（税込）</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">ステータス</TableHead>
                    <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((c, index) => (
                    <TableRow
                      key={c.id}
                      className={`cursor-pointer transition-colors ${
                        c.status === "発行済み"
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                          : "hover:bg-slate-50/80"
                      }`}
                      onClick={() => openDetail(index)}
                    >
                      <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(c.id)}
                          onCheckedChange={() => toggleRow(c.id)}
                          aria-label={`${c.customerName}を選択`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-700 tabular-nums">{c.customerCode}</TableCell>
                      <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{c.customerName}</TableCell>
                      <TableCell className="text-sm text-slate-700">{c.closingDay}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">{c.projectCount}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">{c.manDays.toFixed(1)}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(c.baseAmount)}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(c.transportCost)}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(c.allowances)}</TableCell>
                      <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium whitespace-nowrap px-3">{formatJPY(c.subtotal)}</TableCell>
                      <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(c.tax)}</TableCell>
                      <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-bold whitespace-nowrap px-3">{formatJPY(c.totalWithTax)}</TableCell>
                      <TableCell>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {c.status === "未発行" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                              onClick={() => handleIssue(c.id)}
                            >
                              発行
                            </Button>
                          )}
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => openDetail(index)}
                          >
                            詳細
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total row */}
                  <TableRow className="bg-slate-100 border-t-2 border-slate-300 hover:bg-slate-100 font-bold">
                    <TableCell />
                    <TableCell />
                    <TableCell className="text-sm text-slate-900">合計</TableCell>
                    <TableCell />
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums">{totals.projectCount}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums">{totals.manDays.toFixed(1)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.baseAmount)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.transportCost)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.allowances)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.subtotal)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.tax)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums whitespace-nowrap px-3">{formatJPY(totals.totalWithTax)}</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                {filteredCustomers.length}社 表示中
              </span>
            </div>
          </div>
        </>
      )}

      {/* Empty state before aggregation */}
      {!isAggregated && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              請求年月・締日を選択し、「集計実行」ボタンを押してください。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Panel */}
      <BillingDetailPanel
        customer={selectedCustomer}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onIssue={handleIssue}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(filteredCustomers.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredCustomers.length - 1}
      />
    </div>
  )
}
