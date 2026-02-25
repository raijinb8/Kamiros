"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Search,
  X,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { AttendanceRequest, RequestStatus, StampType } from "@/lib/request-data"
import { SAMPLE_ATTENDANCE } from "@/lib/request-data"
import { AttendanceDetailPanel } from "./attendance-detail-panel"
import { toast } from "sonner"

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "承認待ち") {
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

function StampTypeBadge({ type }: { type: StampType }) {
  if (type === "到着") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs" variant="outline">
        {type}
      </Badge>
    )
  }
  return (
    <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs" variant="outline">
      {type}
    </Badge>
  )
}

function formatDiff(minutes: number): string {
  if (minutes === 0) return "\u00B10\u5206"
  return minutes > 0 ? `+${minutes}\u5206` : `${minutes}\u5206`
}

export function AttendanceTab() {
  const [requests, setRequests] = useState<AttendanceRequest[]>(SAMPLE_ATTENDANCE)
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 25))
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [workerFilter, setWorkerFilter] = useState("all")
  const [stampTypeFilter, setStampTypeFilter] = useState("all")
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
      if (stampTypeFilter !== "all" && r.stampType !== stampTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      return true
    })
  }, [requests, workerFilter, stampTypeFilter, statusFilter])

  const kpi = useMemo(() => {
    const total = requests.length
    const pending = requests.filter((r) => r.status === "承認待ち").length
    const approved = requests.filter((r) => r.status === "承認済み").length
    const rejected = requests.filter((r) => r.status === "却下").length
    return { total, pending, approved, rejected }
  }, [requests])

  const allSelected = filteredRequests.length > 0 && filteredRequests.every((r) => selectedIds.has(r.id))
  const someSelected = filteredRequests.some((r) => selectedIds.has(r.id)) && !allSelected

  const pendingSelectedCount = useMemo(() => {
    return filteredRequests.filter((r) => selectedIds.has(r.id) && r.status === "承認待ち").length
  }, [filteredRequests, selectedIds])

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
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const approveRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "承認済み" as RequestStatus } : r))
    )
    toast.success("承認しました")
  }, [])

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "却下" as RequestStatus } : r))
    )
    toast.error("却下しました")
  }, [])

  const bulkApprove = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && r.status === "承認待ち"
          ? { ...r, status: "承認済み" as RequestStatus }
          : r
      )
    )
    setSelectedIds(new Set())
    toast.success(`${pendingSelectedCount}件を一括承認しました`)
  }, [selectedIds, pendingSelectedCount])

  const bulkReject = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && r.status === "承認待ち"
          ? { ...r, status: "却下" as RequestStatus }
          : r
      )
    )
    setSelectedIds(new Set())
    toast.error(`${pendingSelectedCount}件を一括却下しました`)
  }, [selectedIds, pendingSelectedCount])

  const clearFilters = useCallback(() => {
    setWorkerFilter("all")
    setStampTypeFilter("all")
    setStatusFilter("all")
  }, [])

  const hasActiveFilters =
    workerFilter !== "all" || stampTypeFilter !== "all" || statusFilter !== "all"

  const openDetail = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  const selectedRequest = selectedIndex >= 0 ? filteredRequests[selectedIndex] : null

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              本日の打刻数
            </CardTitle>
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{kpi.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">承認待ち</CardTitle>
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

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              却下・要確認
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{kpi.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Area */}
      <div className="flex flex-wrap items-end gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">日付</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal text-slate-700 border-slate-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                {date ? format(date, "yyyy/MM/dd", { locale: ja }) : "日付を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d)
                  setCalendarOpen(false)
                }}
                locale={ja}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">作業員名</label>
          <Select value={workerFilter} onValueChange={setWorkerFilter}>
            <SelectTrigger className="w-[160px] border-slate-300 text-slate-700">
              <SelectValue placeholder="全員" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全員</SelectItem>
              {workers.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">打刻種別</label>
          <Select value={stampTypeFilter} onValueChange={setStampTypeFilter}>
            <SelectTrigger className="w-[140px] border-slate-300 text-slate-700">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="到着">到着</SelectItem>
              <SelectItem value="退勤">退勤</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">ステータス</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] border-slate-300 text-slate-700">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="承認待ち">承認待ち</SelectItem>
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
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4 mr-1" />
            クリア
          </Button>
        )}
      </div>

      {/* Batch Action Bar */}
      {pendingSelectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800">
            選択した <strong>{pendingSelectedCount}件</strong> を処理
          </span>
          <Button
            size="sm"
            onClick={bulkApprove}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
          >
            一括承認
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={bulkReject}
            className="border-red-300 text-red-700 hover:bg-red-50 h-7 text-xs"
          >
            一括却下
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
                <TableHead className="text-slate-600 text-xs font-semibold">申請日時</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">作業員名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">種別</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">打刻時刻</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">対象日</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">手配番号</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">現場名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold w-10">GPS</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">予定時刻</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">差異</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req, index) => {
                const isHighDiff = Math.abs(req.diffMinutes) >= 15
                const isRejected = req.status === "却下"
                return (
                  <TableRow
                    key={req.id}
                    className={`cursor-pointer transition-colors ${
                      isRejected
                        ? "bg-red-50/60 hover:bg-red-50"
                        : isHighDiff
                          ? "bg-amber-50/60 hover:bg-amber-50"
                          : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => openDetail(index)}
                  >
                    <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(req.id)}
                        onCheckedChange={() => toggleRow(req.id)}
                        aria-label={`${req.orderNumber}を選択`}
                      />
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs font-mono tabular-nums whitespace-nowrap">
                      {req.submittedAt}
                    </TableCell>
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">
                      {req.workerName}
                    </TableCell>
                    <TableCell>
                      <StampTypeBadge type={req.stampType} />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-700 tabular-nums">
                      {req.stampTime}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{req.targetDate}</TableCell>
                    <TableCell className="font-mono text-sm text-slate-700 tabular-nums whitespace-nowrap">
                      {req.orderNumber}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 max-w-[140px] truncate">
                      {req.siteName}
                    </TableCell>
                    <TableCell className="text-center">
                      {req.hasGps ? (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-blue-50 text-blue-500 hover:bg-blue-100 cursor-default">
                                <MapPin className="h-3.5 w-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-sm">GPS情報あり</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-slate-300">{"—"}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-600 tabular-nums">
                      {req.scheduledTime}
                    </TableCell>
                    <TableCell
                      className={`font-mono text-sm tabular-nums whitespace-nowrap ${
                        isHighDiff ? "text-red-600 font-semibold" : "text-slate-600"
                      }`}
                    >
                      {isHighDiff && (
                        <AlertTriangle className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
                      )}
                      {formatDiff(req.diffMinutes)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {req.status === "承認待ち" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                              onClick={() => approveRequest(req.id)}
                            >
                              承認
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => rejectRequest(req.id)}
                            >
                              却下
                            </Button>
                          </>
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

      {/* Detail Panel */}
      <AttendanceDetailPanel
        request={selectedRequest}
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
