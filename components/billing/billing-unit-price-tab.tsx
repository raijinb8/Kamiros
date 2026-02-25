"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "lucide-react"
import { unitPriceSettings, formatJPY } from "@/lib/billing-data"
import type { UnitPriceEntry } from "@/lib/billing-data"

function DetailForm({ entry }: { entry: UnitPriceEntry }) {
  const fields: { label: string; value: string }[] = [
    { label: "基本単価（フル）", value: formatJPY(entry.fullPrice) },
    { label: "基本単価（ハーフ）", value: formatJPY(entry.halfPrice) },
    { label: "残業基準時間（フル）", value: entry.overtimeBaseFull },
    { label: "残業基準時間（ハーフ）", value: entry.overtimeBaseHalf },
    { label: "締日", value: entry.closingDay },
    { label: "回収サイクル", value: entry.collectionCycle },
    { label: "回収日", value: entry.collectionDay },
    { label: "売上税区分", value: entry.taxCategory },
    { label: "消費税端数処理", value: entry.taxRounding },
    { label: "使用請求書レイアウト", value: entry.invoiceLayout },
  ]

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="pt-5 pb-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          {entry.customerName}の単価情報
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between py-1.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">{f.label}</span>
              <span className="text-sm font-medium text-slate-900 font-mono tabular-nums">{f.value}</span>
            </div>
          ))}
        </div>

        {entry.memo && (
          <>
            <Separator className="my-4" />
            <div>
              <span className="text-sm text-slate-500">基本単価メモ</span>
              <p className="text-sm text-slate-900 mt-1">{entry.memo}</p>
            </div>
          </>
        )}

        <Separator className="my-4" />
        <a
          href="/settings"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
        >
          マスタ管理で編集
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardContent>
    </Card>
  )
}

export function BillingUnitPriceTab() {
  const [selectedCustomer, setSelectedCustomer] = useState("all")

  const selectedEntry = useMemo(() => {
    if (selectedCustomer === "all") return null
    return unitPriceSettings.find((e) => e.customerCode === selectedCustomer) || null
  }, [selectedCustomer])

  return (
    <div className="space-y-4">
      {/* Customer selector */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">顧客名</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-72 h-9 text-sm">
                  <SelectValue placeholder="顧客を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全顧客一覧を表示</SelectItem>
                  {unitPriceSettings.map((e) => (
                    <SelectItem key={e.customerCode} value={e.customerCode}>
                      {e.customerCode} - {e.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected customer detail */}
      {selectedEntry && <DetailForm entry={selectedEntry} />}

      {/* All customers table (shown when no specific customer selected) */}
      {!selectedEntry && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客CD</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">顧客名</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">フル単価</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap">ハーフ単価</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">締日</TableHead>
                  <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">回収サイクル</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitPriceSettings.map((e) => (
                  <TableRow
                    key={e.customerCode}
                    className="hover:bg-slate-50/80 cursor-pointer"
                    onClick={() => setSelectedCustomer(e.customerCode)}
                  >
                    <TableCell className="font-mono text-sm text-slate-700 tabular-nums">{e.customerCode}</TableCell>
                    <TableCell className="text-sm text-slate-900 font-medium whitespace-nowrap">{e.customerName}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium">{formatJPY(e.fullPrice)}</TableCell>
                    <TableCell className="text-sm text-slate-900 text-right font-mono tabular-nums font-medium">{formatJPY(e.halfPrice)}</TableCell>
                    <TableCell className="text-sm text-slate-700">{e.closingDay}</TableCell>
                    <TableCell className="text-sm text-slate-700">{e.collectionCycle}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {unitPriceSettings.length}社 表示中
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
