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
import { Building2, TrendingUp, Plus, Search, RotateCcw, MoreHorizontal, Pencil, Ban, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import type { Customer, CustomerStatus } from "@/lib/master-data"
import { customers as initialCustomers, houseMakers, formatJPY } from "@/lib/master-data"
import { CustomerDetailPanel } from "./customer-detail-panel"
import { CustomerEditModal } from "./customer-edit-modal"

const PAGE_SIZE = 20

export function CustomerTab() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchText, setSearchText] = useState("")
  const [hmFilter, setHmFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // Filtering
  const filteredCustomers = useMemo(() => {
    let result = customers
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      )
    }
    if (hmFilter !== "all") {
      result = result.filter((c) => c.housemaker === hmFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    return result
  }, [customers, searchText, hmFilter, statusFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))
  const pagedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCustomers.slice(start, start + PAGE_SIZE)
  }, [filteredCustomers, currentPage])

  // KPIs
  const kpis = useMemo(() => {
    const total = customers.length
    const activeThisMonth = customers.filter((c) => c.status === "有効" && c.monthlyProjects > 0).length
    const newThisMonth = 3
    return { total, activeThisMonth, newThisMonth }
  }, [customers])

  const handleClear = useCallback(() => {
    setSearchText("")
    setHmFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }, [])

  const openDetail = useCallback((index: number) => {
    setSelectedIndex(index)
    setPanelOpen(true)
  }, [])

  const openNewModal = useCallback(() => {
    setEditingCustomer(null)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((customer: Customer) => {
    setEditingCustomer(customer)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback((customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.find((c) => c.id === customer.id)
      if (exists) {
        return prev.map((c) => (c.id === customer.id ? customer : c))
      }
      return [...prev, customer]
    })
    setModalOpen(false)
    toast.success(editingCustomer ? "得意先情報を更新しました" : "得意先を新規登録しました")
  }, [editingCustomer])

  const handleToggleStatus = useCallback((id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: (c.status === "有効" ? "無効" : "有効") as CustomerStatus }
          : c
      )
    )
    toast.success("ステータスを変更しました")
  }, [])

  const selectedCustomer = selectedIndex >= 0 ? filteredCustomers[selectedIndex] : null

  return (
    <div className="space-y-4 min-w-0">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">登録得意先数</CardTitle>
            <Building2 className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {kpis.total}
              <span className="text-base font-normal text-slate-500 ml-1">社</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">今月取引あり</CardTitle>
            <Building2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {kpis.activeThisMonth}
              <span className="text-base font-normal text-blue-400 ml-1">社</span>
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
              <span className="text-base font-normal text-emerald-400 ml-1">社</span>
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
                  placeholder="得意先名・コードで検索"
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
              <label className="text-xs font-medium text-slate-600">HM</label>
              <Select value={hmFilter} onValueChange={(v) => { setHmFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {houseMakers.map((hm) => (
                    <SelectItem key={hm.id} value={hm.name}>
                      {hm.name}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="有効">有効</SelectItem>
                  <SelectItem value="無効">無効</SelectItem>
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

      {/* Customer table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">得意先コード</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">得意先名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">HM</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">フル単価</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[100px]">ハーフ単価</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">電話番号</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">締め日</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">今月案件数</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedCustomers.map((c, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index
                return (
                  <TableRow
                    key={c.id}
                    className={`cursor-pointer transition-colors ${
                      c.status === "無効"
                        ? "opacity-60 bg-slate-50/50 hover:bg-slate-100/50"
                        : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => openDetail(globalIndex)}
                  >
                    <TableCell className="font-mono text-sm text-slate-700 tabular-nums">{c.code}</TableCell>
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{c.name}</TableCell>
                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">{c.housemaker}</TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(c.fullPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatJPY(c.halfPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 font-mono tabular-nums whitespace-nowrap">{c.phone}</TableCell>
                    <TableCell className="text-sm text-slate-700 whitespace-nowrap">{c.closingDay}</TableCell>
                    <TableCell className="text-sm text-right font-mono tabular-nums">
                      <span className="text-blue-600 hover:underline">{c.monthlyProjects}</span>
                    </TableCell>
                    <TableCell>
                      {c.status === "有効" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" variant="outline">
                          有効
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-300 text-xs" variant="outline">
                          無効
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                          onClick={() => openEditModal(c)}
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
                            <DropdownMenuItem onClick={() => openEditModal(c)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(c.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              {c.status === "有効" ? "無効にする" : "有効にする"}
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
            {filteredCustomers.length}件中 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredCustomers.length)}件 表示
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
      <CustomerDetailPanel
        customer={selectedCustomer}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onEdit={openEditModal}
        onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setSelectedIndex((prev) => Math.min(filteredCustomers.length - 1, prev + 1))}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredCustomers.length - 1}
      />

      {/* Edit/New Modal */}
      <CustomerEditModal
        customer={editingCustomer}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />
    </div>
  )
}
