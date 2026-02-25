"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Download, Search, RotateCcw } from "lucide-react"
import { billingHistory, formatJPY } from "@/lib/billing-data"
import { toast } from "sonner"

export function BillingHistoryTab() {
  const [monthFrom, setMonthFrom] = useState("2025-12")
  const [monthTo, setMonthTo] = useState("2026-02")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [isSearched, setIsSearched] = useState(false)

  const customerOptions = useMemo(() => {
    const unique = Array.from(new Set(billingHistory.map((h) => h.customerName)))
    return unique.sort()
  }, [])

  const filtered = useMemo(() => {
    if (!isSearched) return []
    let data = billingHistory

    // Simple month range filter
    const fromKey = monthFrom.replace("-", "/")
    const toKey = monthTo.replace("-", "/")
    data = data.filter((h) => {
      const m = h.billingMonth
      return m >= fromKey && m <= toKey
    })

    if (customerFilter !== "all") {
      data = data.filter((h) => h.customerName === customerFilter)
    }

    return data
  }, [isSearched, monthFrom, monthTo, customerFilter])

  const handleSearch = useCallback(() => {
    setIsSearched(true)
    toast.success("検索を実行しました")
  }, [])

  const handleClear = useCallback(() => {
    setIsSearched(false)
    setMonthFrom("2025-12")
    setMonthTo("2026-02")
    setCustomerFilter("all")
  }, [])

  return (
    <div className="space-y-4">
      {/* Filter */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">請求年月（開始）</label>
              <Select value={monthFrom} onValueChange={setMonthFrom}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-04">2025年4月</SelectItem>
                  <SelectItem value="2025-05">2025年5月</SelectItem>
                  <SelectItem value="2025-06">2025年6月</SelectItem>
                  <SelectItem value="2025-07">2025年7月</SelectItem>
                  <SelectItem value="2025-08">2025年8月</SelectItem>
                  <SelectItem value="2025-09">2025年9月</SelectItem>
                  <SelectItem value="2025-10">2025年10月</SelectItem>
                  <SelectItem value="2025-11">2025年11月</SelectItem>
                  <SelectItem value="2025-12">2025年12月</SelectItem>
                  <SelectItem value="2026-01">2026年1月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-1">
              <span className="text-sm text-slate-400">-</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">請求年月（終了）</label>
              <Select value={monthTo} onValueChange={setMonthTo}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-04">2025年4月</SelectItem>
                  <SelectItem value="2025-05">2025年5月</SelectItem>
                  <SelectItem value="2025-06">2025年6月</SelectItem>
                  <SelectItem value="2025-07">2025年7月</SelectItem>
                  <SelectItem value="2025-08">2025年8月</SelectItem>
                  <SelectItem value="2025-09">2025年9月</SelectItem>
                  <SelectItem value="2025-10">2025年10月</SelectItem>
                  <SelectItem value="2025-11">2025年11月</SelectItem>
                  <SelectItem value="2025-12">2025年12月</SelectItem>
                  <SelectItem value="2026-01">2026年1月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">顧客名</label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="w-52 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全顧客</SelectItem>
                  {customerOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Search className="h-4 w-4 mr-1.5" />
                検索
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="h-9 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {isSearched && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">請求年月</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客CD</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客名</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">締日</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[130px]">請求金額（税込）</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">発行日</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-sm text-slate-500">
                      該当する請求実績がありません。
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((h) => (
                    <TableRow key={h.id} className="hover:bg-slate-50/80">
                      <TableCell className="text-sm text-slate-700 font-mono tabular-nums">{h.billingMonth}</TableCell>
                      <TableCell className="text-sm text-slate-700 font-mono tabular-nums">{h.customerCode}</TableCell>
                      <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{h.customerName}</TableCell>
                      <TableCell className="text-sm text-slate-700">{h.closingDay}</TableCell>
                      <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-bold whitespace-nowrap">{formatJPY(h.totalWithTax)}</TableCell>
                      <TableCell className="text-sm text-slate-700 font-mono tabular-nums">{h.issuedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={() => toast.info("PDF出力機能は実装予定です")}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => toast.info("詳細表示は実装予定です")}
                          >
                            詳細
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {filtered.length}件 表示中
            </span>
          </div>
        </div>
      )}

      {!isSearched && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              請求年月の範囲を選択し、「検索」ボタンを押してください。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
