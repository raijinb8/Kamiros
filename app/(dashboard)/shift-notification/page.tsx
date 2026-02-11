"use client"

import { Suspense } from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, Calendar, Clock, Users, Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useShift } from "@/lib/shift-context"

// Time filter options
const timeFilters = [
  { value: "all", label: "すべての時間" },
  { value: "08-10", label: "08:00～10:00" },
  { value: "10-12", label: "10:00～12:00" },
  { value: "12-14", label: "12:00～14:00" },
  { value: "14-16", label: "14:00～16:00" },
  { value: "16-18", label: "16:00～18:00" },
  { value: "18+", label: "18:00以降" },
]

// Trading partner filter options
const tradingPartnerFilters = [
  { value: "all", label: "すべての取引先" },
  { value: "ジューテック開発2", label: "ジューテック開発" },
  { value: "加藤ベニヤ本社", label: "加藤ベニヤ本社" },
]

// Assignment status filter options
const assignmentStatusFilters = [
  { value: "all", label: "すべて" },
  { value: "unassigned", label: "未割当" },
  { value: "assigned", label: "割当済" },
  { value: "partial", label: "部分割当" },
]

function ShiftNotificationContent() {
  const router = useRouter()
  const { selectedDate, setSelectedDate, sites, workers, assignWorkerToSite } = useShift()

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [partnerFilter, setPartnerFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Helper to check time range
  const isInTimeRange = (time: string, filter: string) => {
    if (filter === "all") return true
    const hour = Number.parseInt(time.split(":")[0], 10)
    switch (filter) {
      case "08-10":
        return hour >= 8 && hour < 10
      case "10-12":
        return hour >= 10 && hour < 12
      case "12-14":
        return hour >= 12 && hour < 14
      case "14-16":
        return hour >= 14 && hour < 16
      case "16-18":
        return hour >= 16 && hour < 18
      case "18+":
        return hour >= 18
      default:
        return true
    }
  }

  // Helper to get assignment status
  const getAssignmentStatus = (assignedWorkers: (string | null)[]) => {
    const assigned = assignedWorkers.filter((w) => w !== null).length
    if (assigned === 0) return "unassigned"
    if (assigned === assignedWorkers.length) return "assigned"
    return "partial"
  }

  // Filter sites
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      if (searchQuery && !site.siteName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (!isInTimeRange(site.time, timeFilter)) {
        return false
      }
      if (partnerFilter !== "all" && site.tradingPartner !== partnerFilter) {
        return false
      }
      if (statusFilter !== "all" && getAssignmentStatus(site.assignedWorkers) !== statusFilter) {
        return false
      }
      return true
    })
  }, [sites, searchQuery, timeFilter, partnerFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage)
  const paginatedSites = filteredSites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTimeFilter("all")
    setPartnerFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const getAvailableWorkersForSlot = (siteId: string, slotIndex: number) => {
    const site = sites.find((s) => s.id === siteId)
    if (!site) return workers

    const assignedInSite = site.assignedWorkers.filter((w, idx) => w !== null && idx !== slotIndex)
    return workers.filter((worker) => !assignedInSite.includes(worker.name))
  }

  const handleWorkerChange = (siteId: string, slotIndex: number, value: string) => {
    assignWorkerToSite(siteId, slotIndex, value === "none" ? null : value)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">シフト連絡一斉送信 - 現場と人の紐付け</h1>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-blue-800">
          明日（1月15日）のシフト：対象 <span className="font-bold">45名</span> の作業員へメールを送信します。
        </p>
      </div>

      {/* Section 1: Date Selection */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            日付選択
          </CardTitle>
          <p className="text-sm text-slate-500">シフトを組む日付を選択してください。その日の現場一覧が表示されます。</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="shift-date" className="text-sm font-medium text-slate-700">
              シフト対象日
            </Label>
            <Input
              id="shift-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Search & Filter */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            検索・フィルター機能
          </CardTitle>
          <p className="text-sm text-slate-500">
            100現場の中から、必要な現場を素早く見つけるために、検索・フィルター機能を使用してください。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="現場名で検索..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Time Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">時間帯</Label>
              <Select value={timeFilter} onValueChange={(v) => handleFilterChange(setTimeFilter, v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trading Partner Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">取引先</Label>
              <Select value={partnerFilter} onValueChange={(v) => handleFilterChange(setPartnerFilter, v)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tradingPartnerFilters.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Status Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">紐付け状態</Label>
              <div className="flex gap-1">
                {assignmentStatusFilters.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={statusFilter === opt.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(setStatusFilter, opt.value)}
                    className={statusFilter === opt.value ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-500 hover:text-slate-700">
              フィルターをリセット
            </Button>
          </div>

          {/* Filter Result Count */}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-slate-600">
              表示中：<span className="font-semibold">{filteredSites.length}</span> / {sites.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Site-Worker Assignment Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            現場に作業員を紐付け
          </CardTitle>
          <p className="text-sm text-slate-500">
            各現場に対して、割り当てる作業員をプルダウンで選択してください。選択すると、メール本文がリアルタイムで更新されます。
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700 w-20">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      時間
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[180px]">現場名</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">取引先</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[150px]">住所</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">作業員1</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">作業員2</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">作業員3</TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">作業員4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSites.map((site) => {
                  const status = getAssignmentStatus(site.assignedWorkers)
                  return (
                    <TableRow
                      key={site.id}
                      className={
                        status === "assigned" ? "bg-green-50/50" : status === "partial" ? "bg-yellow-50/50" : "bg-white"
                      }
                    >
                      <TableCell className="font-medium text-slate-900">{site.time}</TableCell>
                      <TableCell className="text-slate-700 font-medium">{site.siteName}</TableCell>
                      <TableCell className="text-slate-600">{site.tradingPartner}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{site.address}</TableCell>
                      {Array.from({ length: 4 }).map((_, slotIndex) => {
                        if (slotIndex >= site.requiredWorkers) {
                          return (
                            <TableCell key={slotIndex}>
                              <div className="h-9 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-sm">
                                —
                              </div>
                            </TableCell>
                          )
                        }

                        const availableWorkers = getAvailableWorkersForSlot(site.id, slotIndex)
                        const currentValue = site.assignedWorkers[slotIndex]

                        return (
                          <TableCell key={slotIndex}>
                            <Select
                              value={currentValue || "none"}
                              onValueChange={(value) => handleWorkerChange(site.id, slotIndex, value)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none" className="text-slate-400">
                                  選択してください
                                </SelectItem>
                                {availableWorkers.map((worker) => (
                                  <SelectItem key={worker.id} value={worker.name}>
                                    {worker.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">1ページあたり</Label>
              <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-slate-500">
                表示中：{(currentPage - 1) * itemsPerPage + 1}～
                {Math.min(currentPage * itemsPerPage, filteredSites.length)} / {filteredSites.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                前へ
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-blue-600" : ""}
                  >
                    {page}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                次へ
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          onClick={() => router.push("/shift-notification/send")}
        >
          メール確認へ進む
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

export default function ShiftNotificationPage() {
  return (
    <Suspense fallback={null}>
      <ShiftNotificationContent />
    </Suspense>
  )
}
