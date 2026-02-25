"use client"

import { useState, useCallback, useMemo } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MessageSquareText, CheckCircle2 } from "lucide-react"
import type { SiteReport, ReportStatus } from "@/lib/site-report-data"
import { ReportDetailPanel } from "@/components/site-report-detail-panel"
import { toast } from "sonner"

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === "未確認") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs" variant="outline">
        {status}
      </Badge>
    )
  }
  if (status === "確認済み") {
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

interface SiteReportTableProps {
  reports: SiteReport[]
  onReportsChange: (reports: SiteReport[]) => void
}

export function SiteReportTable({ reports, onReportsChange }: SiteReportTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedReportIndex, setSelectedReportIndex] = useState<number>(-1)

  const selectedReport = selectedReportIndex >= 0 ? reports[selectedReportIndex] : null

  const allSelected = reports.length > 0 && selectedIds.size === reports.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const unconfirmedSelectedCount = useMemo(() => {
    return reports.filter((r) => selectedIds.has(r.id) && r.status === "未確認").length
  }, [reports, selectedIds])

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(reports.map((r) => r.id)))
    }
  }, [allSelected, reports])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const openDetail = useCallback(
    (index: number) => {
      setSelectedReportIndex(index)
      setPanelOpen(true)
    },
    []
  )

  const confirmReport = useCallback(
    (id: string) => {
      onReportsChange(
        reports.map((r) => (r.id === id ? { ...r, status: "確認済み" as ReportStatus } : r))
      )
      toast.success("確認済みにしました")
    },
    [reports, onReportsChange]
  )

  const markDiff = useCallback(
    (id: string) => {
      onReportsChange(
        reports.map((r) => (r.id === id ? { ...r, status: "差異あり" as ReportStatus } : r))
      )
      toast.warning("差異ありに変更しました")
    },
    [reports, onReportsChange]
  )

  const bulkConfirm = useCallback(() => {
    onReportsChange(
      reports.map((r) =>
        selectedIds.has(r.id) && r.status === "未確認"
          ? { ...r, status: "確認済み" as ReportStatus }
          : r
      )
    )
    setSelectedIds(new Set())
    toast.success(`${unconfirmedSelectedCount}件を確認済みにしました`)
  }, [reports, selectedIds, unconfirmedSelectedCount, onReportsChange])

  return (
    <>
      {/* Batch action bar */}
      {unconfirmedSelectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-3">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800">
            選択した <strong>{unconfirmedSelectedCount}件</strong> を確認済みにする
          </span>
          <Button
            size="sm"
            onClick={bulkConfirm}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
          >
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
                <TableHead className="text-slate-600 text-xs font-semibold">現場日付</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">手配番号</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">顧客名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">現場名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">開始</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">終了</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">時間</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">立会者</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold w-10">備考</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow
                  key={report.id}
                  className={`cursor-pointer transition-colors ${
                    report.status === "差異あり"
                      ? "bg-red-50/60 hover:bg-red-50"
                      : "hover:bg-slate-50/80"
                  }`}
                  onClick={() => openDetail(index)}
                >
                  <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(report.id)}
                      onCheckedChange={() => toggleRow(report.id)}
                      aria-label={`${report.orderNumber}を選択`}
                    />
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs font-mono tabular-nums">
                    {report.reportedAt.split(" ")[1]}
                  </TableCell>
                  <TableCell className="text-sm text-slate-900 font-medium">
                    {report.workerName}
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">{report.workDate}</TableCell>
                  <TableCell className="font-mono text-sm text-slate-700 tabular-nums">
                    {report.orderNumber}
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">{report.clientName}</TableCell>
                  <TableCell className="text-sm text-slate-700 max-w-[160px] truncate">
                    {report.siteName}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600 tabular-nums">
                    {report.startTime}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600 tabular-nums">
                    {report.endTime}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600 tabular-nums">
                    {report.duration}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-[120px] truncate">
                    {report.witness}
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
                        onClick={() => openDetail(index)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            1-{reports.length} / {reports.length}件
          </span>
        </div>
      </div>

      {/* Detail panel */}
      <ReportDetailPanel
        report={selectedReport}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onConfirm={confirmReport}
        onMarkDiff={markDiff}
        onPrev={() => setSelectedReportIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedReportIndex((prev) => Math.min(reports.length - 1, prev + 1))}
        hasPrev={selectedReportIndex > 0}
        hasNext={selectedReportIndex < reports.length - 1}
      />
    </>
  )
}
