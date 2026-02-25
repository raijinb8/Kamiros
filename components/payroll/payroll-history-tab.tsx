"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Search, RotateCcw, Download, FileText } from "lucide-react"
import { payrollHistory, formatPayrollJPY } from "@/lib/payroll-data"

export function PayrollHistoryTab() {
  const [monthFrom, setMonthFrom] = useState("2025-08")
  const [monthTo, setMonthTo] = useState("2026-02")
  const [isSearched, setIsSearched] = useState(false)

  const filteredHistory = useMemo(() => {
    if (!isSearched) return []
    return payrollHistory
  }, [isSearched])

  const handleSearch = () => {
    setIsSearched(true)
  }

  const handleClear = () => {
    setIsSearched(false)
    setMonthFrom("2025-08")
    setMonthTo("2026-02")
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Filter area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">処理年月（開始）</label>
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

            <div className="flex items-center self-end pb-2">
              <span className="text-sm text-slate-500">〜</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">処理年月（終了）</label>
              <Select value={monthTo} onValueChange={setMonthTo}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

      {isSearched && filteredHistory.length > 0 && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">処理年月</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">対象人数</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[130px] px-3">支給総額</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[130px] px-3">控除総額</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap min-w-[140px] px-3">差引支給総額</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">ステータス</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((h) => (
                  <TableRow key={h.id} className="hover:bg-slate-50/80">
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{h.month}</TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">
                      {h.workerCount}名
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                      {formatPayrollJPY(h.payTotal)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums whitespace-nowrap px-3">
                      {formatPayrollJPY(h.deductionTotal)}
                    </TableCell>
                    <TableCell className="text-sm text-blue-800 text-right font-mono tabular-nums font-bold whitespace-nowrap px-3">
                      {formatPayrollJPY(h.netTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" variant="outline">
                        {h.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                          詳細
                        </button>
                        <span className="text-slate-300">|</span>
                        <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          CSV再出力
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-500">{filteredHistory.length}件 表示中</span>
          </div>
        </div>
      )}

      {isSearched && filteredHistory.length === 0 && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              該当する給与実績がありません。
            </p>
          </CardContent>
        </Card>
      )}

      {!isSearched && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              処理年月を指定し、「検索」ボタンを押してください。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
