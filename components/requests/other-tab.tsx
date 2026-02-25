"use client"

import { useState, useMemo, useCallback } from "react"
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
import { Search, X, CheckCircle2 } from "lucide-react"
import type { OtherRequest, ApprovalStatus } from "@/lib/request-data"
import { OTHER_REQUESTS } from "@/lib/request-data"
import { OtherDetailPanel } from "./other-detail-panel"
import { toast } from "sonner"

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "未処理") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs" variant="outline">
        承認待ち
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

function RequestTypeBadge({ type }: { type: string }) {
  if (type === "住所変更") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs" variant="outline">
        住所変更
      </Badge>
    )
  }
  if (type === "口座変更") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs" variant="outline">
        口座変更
      </Badge>
    )
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs" variant="outline">
      その他
    </Badge>
  )
}

export function OtherTab() {
  const [requests, setRequests] = useState<OtherRequest[]>(OTHER_REQUESTS)
  const [workerFilter, setWorkerFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
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
      if (typeFilter !== "all" && r.requestType !== typeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      return true
    })
  }, [requests, workerFilter, typeFilter, statusFilter])

  const pendingSelectedCount = useMemo(
    () => filteredRequests.filter((r) => selectedIds.has(r.id) && r.status === "未処理").length,
    [filteredRequests, selectedIds]
  )

  const allSelected = filteredRequests.length > 0 && selectedIds.size === filteredRequests.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const toggleAll = useCallback(() => {
    setSelectedIds(allSelected ? new Set() : new Set(filteredRequests.map((r) => r.id)))
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
    setTypeFilter("all")
    setStatusFilter("all")
  }, [])

  const approveRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "承認済み" as ApprovalStatus } : r))
    )
    toast.success("申請を承認しました（マスタデータに反映）")
  }, [])

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "却下" as ApprovalStatus } : r))
    )
    toast.error("申請を却下しました")
  }, [])

  const bulkApprove = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && r.status === "未処理" ? { ...r, status: "承認済み" as ApprovalStatus } : r
      )
    )
    setSelectedIds(new Set())
    toast.success(`${pendingSelectedCount}件を一括承認しました`)
  }, [selectedIds, pendingSelectedCount])

  const hasActiveFilters = workerFilter !== "all" || typeFilter !== "all" || statusFilter !== "all"

  return (
    <div className="space-y-5">
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
          <label className="text-xs font-medium text-slate-500">申請種別</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] border-slate-300 text-slate-700">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="住所変更">住所変更</SelectItem>
              <SelectItem value="口座変更">口座変更</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
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
              <SelectItem value="未処理">承認待ち</SelectItem>
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
            選択した <strong>{pendingSelectedCount}件</strong> を一括承認
          </span>
          <Button size="sm" onClick={bulkApprove} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
            一括承認
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
                <TableHead className="text-slate-600 text-xs font-semibold">申請日</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">作業員名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">申請種別</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">内容</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">ステータス</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req, index) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => { setSelectedIndex(index); setPanelOpen(true) }}
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
                    <RequestTypeBadge type={req.requestType} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-700 max-w-[280px] truncate">
                    {req.summary}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {req.status === "未処理" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
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
          <span className="text-xs text-slate-500">1-{filteredRequests.length} / {filteredRequests.length}件</span>
        </div>
      </div>

      {/* Detail panel */}
      <OtherDetailPanel
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
