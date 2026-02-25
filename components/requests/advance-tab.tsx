"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, AlertCircle, CheckCircle2, Banknote, Search, X } from "lucide-react"
import type { AdvanceRequest, ApprovalStatus } from "@/lib/request-data"
import { ADVANCE_REQUESTS } from "@/lib/request-data"
import { AdvanceDetailPanel } from "./advance-detail-panel"
import { toast } from "sonner"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs" variant="outline">
        {status}
      </Badge>
    )
  }
  if (status === "承認済み") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" variant="outline">
        {status}
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs" variant="outline">
      {status}
    </Badge>
  )
}

function TypeBadge({ type }: { type: string }) {
  if (type === "MAX") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs" variant="outline">
        MAX
      </Badge>
    )
  }
  return (
    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs" variant="outline">
      金額指定
    </Badge>
  )
}

function formatYen(amount: number) {
  return `¥${amount.toLocaleString()}`
}

// Threshold for monthly total highlight (yellow background)
const HIGH_MONTHLY_THRESHOLD = 100000

export function AdvanceTab() {
  const [requests, setRequests] = useState<AdvanceRequest[]>(ADVANCE_REQUESTS)
  const [workerFilter, setWorkerFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const workers = useMemo(
    () => Array.from(new Set(requests.map((r) => r.workerName))).sort(),
    [requests]
  )

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (workerFilter !== "all" && r.workerName !== workerFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      return true
    })
  }, [requests, workerFilter, statusFilter])

  const kpi = useMemo(() => {
    const total = requests.length
    const pending = requests.filter((r) => r.status === "未処理").length
    const approved = requests.filter((r) => r.status === "承認済み").length
    const totalAmount = requests
      .filter((r) => r.status === "承認済み" && r.confirmedAmount !== null)
      .reduce((sum, r) => sum + (r.confirmedAmount ?? 0), 0)
    return { total, pending, approved, totalAmount }
  }, [requests])

  const pendingSelectedCount = useMemo(
    () => filteredRequests.filter((r) => selectedIds.has(r.id) && r.status === "未処理").length,
    [filteredRequests, selectedIds]
  )

  const allSelected = filteredRequests.length > 0 && selectedIds.size === filteredRequests.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)))
    }
  }, [allSelected, filteredRequests])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setWorkerFilter("all")
    setStatusFilter("all")
  }, [])

  const openPanel = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  const approveRequest = useCallback(
    (id: string, amount: number) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "承認済み" as ApprovalStatus, confirmedAmount: amount } : r
        )
      )
      toast.success(`内金 ${formatYen(amount)} を承認しました`)
    },
    []
  )

  const rejectRequest = useCallback(
    (id: string) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "却下" as ApprovalStatus } : r))
      )
      toast.error("申請を却下しました")
    },
    []
  )

  const bulkApprove = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) => {
        if (selectedIds.has(r.id) && r.status === "未処理") {
          const amount = r.requestedAmount ?? r.detail.availableAdvance
          return { ...r, status: "承認済み" as ApprovalStatus, confirmedAmount: amount }
        }
        return r
      })
    )
    setSelectedIds(new Set())
    toast.success(`${pendingSelectedCount}件を一括承認しました`)
  }, [selectedIds, pendingSelectedCount])

  const bulkReject = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && r.status === "未処理"
          ? { ...r, status: "却下" as ApprovalStatus }
          : r
      )
    )
    setSelectedIds(new Set())
    toast.error(`${pendingSelectedCount}件を一括却下しました`)
  }, [selectedIds, pendingSelectedCount])

  const hasActiveFilters = workerFilter !== "all" || statusFilter !== "all"

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">今月の申請件数</CardTitle>
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{kpi.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">未処理</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{kpi.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">承認済み</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{kpi.approved}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">今月の内金総額</CardTitle>
            <Banknote className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatYen(kpi.totalAmount)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">申請月</label>
          <Select defaultValue="2026-02">
            <SelectTrigger className="w-[150px] border-slate-300 text-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-02">2026年2月</SelectItem>
              <SelectItem value="2026-01">2026年1月</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">作業員名</label>
          <Select value={workerFilter} onValueChange={setWorkerFilter}>
            <SelectTrigger className="w-[150px] border-slate-300 text-slate-700">
              <SelectValue placeholder="全員" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全員</SelectItem>
              {workers.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">ステータス</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] border-slate-300 text-slate-700">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="未処理">未処理</SelectItem>
              <SelectItem value="承認済み">承認済み</SelectItem>
              <SelectItem value="却下">却下</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Search className="h-4 w-4 mr-1.5" />
          検索
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-slate-700">
            <X className="h-4 w-4 mr-1" />
            クリア
          </Button>
        )}
      </div>

      {/* Batch actions */}
      {pendingSelectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800">
            選択した <strong>{pendingSelectedCount}件</strong> を処理
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={bulkApprove} className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
              一括承認
            </Button>
            <Button size="sm" variant="outline" onClick={bulkReject} className="border-red-300 text-red-700 hover:bg-red-50 h-7 text-xs">
              一括却下
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="全選択"
                  />
                </TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">申請日時</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">作業員名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">申請種別</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right">申請金額</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right">確定金額</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right">当月累計</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req, index) => {
                const isHighTotal = req.monthlyTotal >= HIGH_MONTHLY_THRESHOLD
                return (
                  <TableRow
                    key={req.id}
                    className={`cursor-pointer transition-colors ${
                      isHighTotal ? "bg-yellow-50/60 hover:bg-yellow-50" : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => openPanel(index)}
                  >
                    <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(req.id)}
                        onCheckedChange={() => toggleRow(req.id)}
                        aria-label={`${req.workerName}の申請を選択`}
                      />
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs font-mono tabular-nums whitespace-nowrap">
                      {req.requestedAt}
                    </TableCell>
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">
                      {req.workerName}
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={req.type} />
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap tabular-nums text-sm text-slate-700 min-w-[100px]">
                      {req.requestedAmount !== null ? formatYen(req.requestedAmount) : "MAX"}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap tabular-nums text-sm font-medium text-slate-900 min-w-[100px]">
                      {req.confirmedAmount !== null ? formatYen(req.confirmedAmount) : "—"}
                    </TableCell>
                    <TableCell className={`text-right whitespace-nowrap tabular-nums text-sm min-w-[100px] ${isHighTotal ? "text-amber-700 font-semibold" : "text-slate-600"}`}>
                      {formatYen(req.monthlyTotal)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {req.status === "未処理" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={() => openPanel(index)}
                          >
                            処理
                          </Button>
                        )}
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={() => openPanel(index)}
                        >
                          詳細
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            1-{filteredRequests.length} / {filteredRequests.length}件
          </span>
        </div>
      </div>

      {/* Detail panel */}
      <AdvanceDetailPanel
        request={selectedIndex >= 0 ? filteredRequests[selectedIndex] : null}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onApprove={approveRequest}
        onReject={rejectRequest}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(filteredRequests.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredRequests.length - 1}
      />
    </div>
  )
}
