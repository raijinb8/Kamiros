"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, UserCheck, TrendingUp, Plus, Search, RotateCcw, MoreHorizontal, Pencil, Ban, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import type { Worker, WorkerStatus } from "@/lib/master-data"
import { workers as initialWorkers, formatJPY } from "@/lib/master-data"
import { WorkerDetailPanel } from "./worker-detail-panel"
import { WorkerEditModal } from "./worker-edit-modal"

const PAGE_SIZE = 20

export function WorkerTab() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers)
  const [searchText, setSearchText] = useState("")
  const [employmentFilter, setEmploymentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)

  // Filtering
  const filteredWorkers = useMemo(() => {
    let result = workers
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      result = result.filter(
        (w) => w.name.toLowerCase().includes(q) || w.no.toString().includes(q)
      )
    }
    if (employmentFilter !== "all") {
      result = result.filter((w) => w.employmentType === employmentFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((w) => w.status === statusFilter)
    }
    return result
  }, [workers, searchText, employmentFilter, statusFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / PAGE_SIZE))
  const pagedWorkers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredWorkers.slice(start, start + PAGE_SIZE)
  }, [filteredWorkers, currentPage])

  // KPIs
  const kpis = useMemo(() => {
    const total = workers.length
    const active = workers.filter((w) => w.status === "在籍").length
    const partTime = workers.filter((w) => w.employmentType === "アルバイト").length
    const contractor = workers.filter((w) => w.employmentType === "個人事業主").length
    const newThisMonth = 2
    return { total, active, partTime, contractor, newThisMonth }
  }, [workers])

  const handleClear = useCallback(() => {
    setSearchText("")
    setEmploymentFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }, [])

  const openDetail = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  const openNewModal = useCallback(() => {
    setEditingWorker(null)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((worker: Worker) => {
    setEditingWorker(worker)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback((worker: Worker) => {
    setWorkers((prev) => {
      const exists = prev.find((w) => w.id === worker.id)
      if (exists) {
        return prev.map((w) => (w.id === worker.id ? worker : w))
      }
      return [...prev, worker]
    })
    setModalOpen(false)
    toast.success(editingWorker ? "作業員情報を更新しました" : "作業員を新規登録しました")
  }, [editingWorker])

  const handleToggleStatus = useCallback((id: string) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: (w.status === "在籍" ? "退職" : "在籍") as WorkerStatus }
          : w
      )
    )
    toast.success("ステータスを変更しました")
  }, [])

  const selectedWorker = selectedIndex >= 0 ? filteredWorkers[selectedIndex] : null

  return (
    <div className="space-y-4 min-w-0">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">登録作業員数</CardTitle>
            <Users className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {kpis.total}
              <span className="text-base font-normal text-slate-500 ml-1">名</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">稼働中</CardTitle>
            <UserCheck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {kpis.active}
              <span className="text-base font-normal text-blue-400 ml-1">名</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">アルバイト / 個人事業主</CardTitle>
            <Users className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {kpis.partTime}
              <span className="text-base font-normal text-slate-500 mx-1">/</span>
              {kpis.contractor}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">新規登録（今月）</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {kpis.newThisMonth}
              <span className="text-base font-normal text-emerald-400 ml-1">名</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter + Action area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5 flex-1 min-w-[200px] max-w-xs">
              <label className="text-xs font-medium text-slate-600">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="作業員名・番号で検索"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">雇用形態</label>
              <Select value={employmentFilter} onValueChange={(v) => { setEmploymentFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="アルバイト">アルバイト</SelectItem>
                  <SelectItem value="個人事業主">個人事業主</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">ステータス</label>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-28 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="在籍">在籍</SelectItem>
                  <SelectItem value="退職">退職</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleClear}
              className="h-9 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              クリア
            </Button>

            <div className="ml-auto">
              <Button
                onClick={openNewModal}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                新規登録
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worker table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="min-w-[1300px]">
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-14">No.</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">氏名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">雇用形態</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">フル単価</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">ハーフ単価</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">遠方手当</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">電話番号</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">入社日</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">今月稼働</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">今月内金</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedWorkers.map((w, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index
                return (
                  <TableRow
                    key={w.id}
                    className={`cursor-pointer transition-colors ${
                      w.status === "退職"
                        ? "opacity-60 bg-slate-50/50 hover:bg-slate-100/50"
                        : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => openDetail(globalIndex)}
                  >
                    <TableCell className="font-mono text-sm text-slate-700 tabular-nums">{w.no}</TableCell>
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{w.name}</TableCell>
                    <TableCell>
                      {w.employmentType === "アルバイト" ? (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs" variant="outline">
                          アルバイト
                        </Badge>
                      ) : (
                        <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs" variant="outline">
                          個人事業主
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(w.fullPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(w.halfPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(w.distanceAllowance)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{w.phone}</TableCell>
                    <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{w.startDate}</TableCell>
                    <TableCell className="text-sm text-right font-mono tabular-nums text-slate-700">{w.monthlyWork}</TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(w.monthlyAdvance)}
                    </TableCell>
                    <TableCell>
                      {w.status === "在籍" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" variant="outline">
                          在籍
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-300 text-xs" variant="outline">
                          退職
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                          onClick={() => openEditModal(w)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">編集</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                              <span className="sr-only">メニュー</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(w)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(w.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              {w.status === "在籍" ? "退職にする" : "在籍にする"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            {filteredWorkers.length}件中 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredWorkers.length)}件 表示
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">前のページ</span>
            </Button>
            <span className="text-xs text-slate-600 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">次のページ</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <WorkerDetailPanel
        worker={selectedWorker}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onEdit={openEditModal}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(filteredWorkers.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredWorkers.length - 1}
      />

      {/* Edit/New Modal */}
      <WorkerEditModal
        worker={editingWorker}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />
    </div>
  )
}
