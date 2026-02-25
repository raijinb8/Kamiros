"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  FileSpreadsheet,
  Search,
  X,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
} from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { SAMPLE_REPORTS, type SiteReport } from "@/lib/site-report-data"
import { SiteReportTable } from "@/components/site-report-table"
import { Toaster } from "sonner"

export default function SiteReportsPage() {
  const [reports, setReports] = useState<SiteReport[]>(SAMPLE_REPORTS)
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 24))
  const [workerFilter, setWorkerFilter] = useState("all")
  const [clientFilter, setClientFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Unique filter options from data
  const workers = useMemo(
    () => Array.from(new Set(reports.map((r) => r.workerName))).sort(),
    [reports]
  )
  const clients = useMemo(
    () => Array.from(new Set(reports.map((r) => r.clientName))).sort(),
    [reports]
  )

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (workerFilter !== "all" && r.workerName !== workerFilter) return false
      if (clientFilter !== "all" && r.clientName !== clientFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      return true
    })
  }, [reports, workerFilter, clientFilter, statusFilter])

  // KPI counts based on all reports (not filtered)
  const kpi = useMemo(() => {
    const total = reports.length
    const unconfirmed = reports.filter((r) => r.status === "未確認").length
    const confirmed = reports.filter((r) => r.status === "確認済み").length
    const hasDiff = reports.filter((r) => r.status === "差異あり").length
    return { total, unconfirmed, confirmed, hasDiff }
  }, [reports])

  const clearFilters = useCallback(() => {
    setWorkerFilter("all")
    setClientFilter("all")
    setStatusFilter("all")
  }, [])

  const hasActiveFilters = workerFilter !== "all" || clientFilter !== "all" || statusFilter !== "all"

  return (
    <div className="space-y-5">
      <Toaster position="top-right" richColors />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">現場終了報告</h1>
        <Button variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel出力
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">本日の報告件数</CardTitle>
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

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">差異あり</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{kpi.hasDiff}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter area */}
      <div className="flex flex-wrap items-end gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        {/* Date picker */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">作業日</label>
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

        {/* Worker filter */}
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

        {/* Client filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">顧客名</label>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[160px] border-slate-300 text-slate-700">
              <SelectValue placeholder="全取引先" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全取引先</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">ステータス</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] border-slate-300 text-slate-700">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="未確認">未確認</SelectItem>
              <SelectItem value="確認済み">確認済み</SelectItem>
              <SelectItem value="差異あり">差異あり</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search / Clear buttons */}
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

      {/* Report table */}
      <SiteReportTable reports={filteredReports} onReportsChange={setReports} />
    </div>
  )
}
