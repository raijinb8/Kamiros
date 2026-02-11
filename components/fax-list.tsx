"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react"
import { FaxListItem } from "@/components/fax-list-item"
import type { FaxItem, FaxStatus } from "@/lib/fax-data"

interface FaxListProps {
  isOpen: boolean
  onClose: () => void
  faxList: FaxItem[]
  selectedFaxId: number
  onSelectFax: (fax: FaxItem) => void
  statusFilter: "all" | FaxStatus
  onStatusFilterChange: (value: "all" | FaxStatus) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  currentPage: number
  onCurrentPageChange: (value: number) => void
  filteredCount: number
  totalPages: number
  paginatedFaxList: FaxItem[]
  startIndex: number
}

const statusButtons = [
  { value: "all" as const, label: "すべて" },
  { value: "unconfirmed" as const, label: "未確認" },
  { value: "confirmed" as const, label: "確認済" },
  { value: "finalized" as const, label: "確定済" },
]

function FaxListInner({
  isOpen,
  onClose,
  paginatedFaxList,
  selectedFaxId,
  onSelectFax,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  onCurrentPageChange,
  filteredCount,
  totalPages,
  startIndex,
}: FaxListProps) {
  return (
    <div
      className={`absolute left-0 top-0 bottom-0 z-30 w-[300px] bg-white border-r border-slate-200 shadow-lg transform transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">FAX一覧</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-500 mb-3">{"検索結果："}{filteredCount}{"件"}</p>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-1 mb-3">
          {statusButtons.map(({ value, label }) => (
            <Button
              key={value}
              variant={statusFilter === value ? "default" : "outline"}
              size="sm"
              className={`text-xs px-2 py-1 h-7 ${statusFilter === value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => {
                onStatusFilterChange(value)
                onCurrentPageChange(1)
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="現場名で検索..."
            value={searchQuery}
            onChange={(e) => {
              onSearchQueryChange(e.target.value)
              onCurrentPageChange(1)
            }}
            className="pl-9 h-9"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs text-slate-500 hover:text-slate-700"
          onClick={() => {
            onStatusFilterChange("all")
            onSearchQueryChange("")
          }}
        >
          フィルターをリセット
        </Button>
      </div>

      {/* FAX List Items */}
      <div className="flex-1 overflow-auto" style={{ height: "calc(100% - 280px)" }}>
        {paginatedFaxList.map((fax) => (
          <FaxListItem
            key={fax.id}
            fax={fax}
            isSelected={fax.id === selectedFaxId}
            onSelect={onSelectFax}
            onClose={onClose}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 absolute bottom-0 left-0 right-0">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>
            {startIndex + 1}{"～"}{Math.min(startIndex + itemsPerPage, filteredCount)} / {filteredCount}
          </span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              onItemsPerPageChange(Number(value))
              onCurrentPageChange(1)
            }}
          >
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCurrentPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-7 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
            前へ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCurrentPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-7 px-2"
          >
            次へ
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const FaxList = memo(FaxListInner)
