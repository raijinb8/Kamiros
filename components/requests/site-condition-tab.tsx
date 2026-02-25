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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ClipboardList, AlertCircle, CheckCircle2, Search, X, Camera, MessageSquareText } from "lucide-react"
import type { SiteConditionReport, ConfirmStatus } from "@/lib/request-data"
import { SITE_CONDITION_REPORTS } from "@/lib/request-data"
import { SiteConditionDetailPanel } from "./site-condition-detail-panel"
import { toast } from "sonner"

function StatusBadge({ status }: { status: ConfirmStatus }) {
  if (status === "未確認") {
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

export function SiteConditionTab() {
  const [reports, setReports] = useState<SiteConditionReport[]>(SITE_CONDITION_REPORTS)
  const [workerFilter, setWorkerFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const workers = useMemo(
    () => Array.from(new Set(reports.map((r) => r.workerName))).sort(),
    [reports]
  )

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (workerFilter !== "all" && r.workerName !== workerFilter) return false
      return true
    })
  }, [reports, workerFilter])

  const kpi = useMemo(() => ({
    total: reports.length,
    unconfirmed: reports.filter((r) => r.status === "未確認").length,
    confirmed: reports.filter((r) => r.status === "確認済み").length,
  }), [reports])

  const unconfirmedSelectedCount = useMemo(
    () => filteredReports.filter((r) => selectedIds.has(r.id) && r.status === "未確認").length,
    [filteredReports, selectedIds]
  )

  const allSelected = filteredReports.length > 0 && selectedIds.size === filteredReports.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const toggleAll = useCallback(() => {
    setSelectedIds(allSelected ? new Set() : new Set(filteredReports.map((r) => r.id)))
  }, [allSelected, filteredReports])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const confirmReport = useCallback(
    (id: string) => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "確認済み" as ConfirmStatus } : r))
      )
      toast.success("確認済みにしました")
    },
    []
  )

  const bulkConfirm = useCallback(() => {
    setReports((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && r.status === "未確認" ? { ...r, status: "確認済み" as ConfirmStatus } : r
      )
    )
    setSelectedIds(new Set())
    toast.success(`${unconfirmedSelectedCount}件を確認済みにしました`)
  }, [selectedIds, unconfirmedSelectedCount])

  const updateMemo = useCallback((id: string, memo: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, adminMemo: memo } : r)))
  }, [])

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">今月の報告件数</CardTitle>
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{kpi.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">未確認</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{kpi.unconfirmed}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">確認済み</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{kpi.confirmed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">報告月</label>
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Search className="h-4 w-4 mr-1.5" />
          検索
        </Button>
        {workerFilter !== "all" && (
          <Button variant="ghost" onClick={() => setWorkerFilter("all")} className="text-slate-500 hover:text-slate-700">
            <X className="h-4 w-4 mr-1" />
            クリア
          </Button>
        )}
      </div>

      {/* Batch actions */}
      {unconfirmedSelectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800">
            選択した <strong>{unconfirmedSelectedCount}件</strong> を確認済みにする
          </span>
          <Button size="sm" onClick={bulkConfirm} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
            一括確認
          </Button>
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
                <TableHead className="text-slate-600 text-xs font-semibold">報告日時</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">作業員名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">現場名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">写真</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold w-10">備考</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report, index) => (
                <TableRow
                  key={report.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => { setSelectedIndex(index); setPanelOpen(true) }}
                >
                  <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(report.id)}
                      onCheckedChange={() => toggleRow(report.id)}
                      aria-label={`${report.siteName}を選択`}
                    />
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs font-mono tabular-nums whitespace-nowrap">
                    {report.reportedAt}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">
                    {report.workerName}
                  </TableCell>
                  <TableCell className="text-sm text-slate-700 max-w-[200px] truncate">
                    {report.siteName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                      <Camera className="h-3.5 w-3.5 text-slate-400" />
                      {report.photoCount}枚
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    {report.notes ? (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-default">
                              <MessageSquareText className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{report.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-slate-300">{"—"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {report.status === "未確認" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => confirmReport(report.id)}
                        >
                          確認
                        </Button>
                      )}
                      <button
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => { setSelectedIndex(index); setPanelOpen(true) }}
                      >
                        詳細
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">1-{filteredReports.length} / {filteredReports.length}件</span>
        </div>
      </div>

      {/* Detail panel */}
      <SiteConditionDetailPanel
        report={selectedIndex >= 0 ? filteredReports[selectedIndex] : null}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onConfirm={confirmReport}
        onUpdateMemo={updateMemo}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(filteredReports.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredReports.length - 1}
      />
    </div>
  )
}
