"use client"

import { useState, memo, useCallback } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  MapPin,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Home,
} from "lucide-react"

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
interface ProjectRow {
  id: string
  date: string
  dayOfWeek: string
  dayType: "weekday" | "saturday" | "sunday"
  time: string
  clientName: string
  contactPerson: string
  siteAddress: string
  mapUrl: string
  workers: number
  category: string
  categoryColor: "blue" | "orange" | "slate" | "emerald" | "rose"
  notes: string
  syncStatus: "synced" | "unsynced"
}

// -------------------------------------------------------------------
// Static mock data
// -------------------------------------------------------------------
const MOCK_DATA: ProjectRow[] = [
  {
    id: "1",
    date: "2/1",
    dayOfWeek: "土",
    dayType: "saturday",
    time: "08:00",
    clientName: "株式会社アクティブ",
    contactPerson: "田中様",
    siteAddress: "川口市並木2-10",
    mapUrl: "https://www.google.com/maps/search/川口市並木2-10",
    workers: 2,
    category: "常用",
    categoryColor: "blue",
    notes: "ヘルメット持参",
    syncStatus: "synced",
  },
  {
    id: "2",
    date: "2/2",
    dayOfWeek: "日",
    dayType: "sunday",
    time: "08:30",
    clientName: "鈴木建設",
    contactPerson: "佐藤様",
    siteAddress: "さいたま市浦和区高砂3-1",
    mapUrl: "https://www.google.com/maps/search/さいたま市浦和区高砂3-1",
    workers: 1,
    category: "手間",
    categoryColor: "orange",
    notes: "駐車場なし、近隣コインP利用",
    syncStatus: "synced",
  },
  {
    id: "3",
    date: "2/3",
    dayOfWeek: "月",
    dayType: "weekday",
    time: "09:00",
    clientName: "(株)山田工務店",
    contactPerson: "鈴木担当",
    siteAddress: "戸田市喜沢南1-5-12",
    mapUrl: "https://www.google.com/maps/search/戸田市喜沢南1-5-12",
    workers: 4,
    category: "常用",
    categoryColor: "blue",
    notes: "2名手元、2名解体",
    syncStatus: "unsynced",
  },
  {
    id: "4",
    date: "2/3",
    dayOfWeek: "月",
    dayType: "weekday",
    time: "13:00",
    clientName: "ジューテック開発",
    contactPerson: "稲村様",
    siteAddress: "横浜市神奈川区六角橋2-8",
    mapUrl: "https://www.google.com/maps/search/横浜市神奈川区六角橋2-8",
    workers: 1,
    category: "UB",
    categoryColor: "emerald",
    notes: "AG3・HM3",
    syncStatus: "synced",
  },
  {
    id: "5",
    date: "2/5",
    dayOfWeek: "水",
    dayType: "weekday",
    time: "08:00",
    clientName: "大成木材",
    contactPerson: "島田様",
    siteAddress: "世田谷区代田4-2-6",
    mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6",
    workers: 2,
    category: "内装材",
    categoryColor: "rose",
    notes: "終日作業",
    syncStatus: "synced",
  },
  {
    id: "6",
    date: "2/7",
    dayOfWeek: "金",
    dayType: "weekday",
    time: "10:00",
    clientName: "加藤ベニヤ本社",
    contactPerson: "高橋様",
    siteAddress: "目黒区八雲1-10-8",
    mapUrl: "https://www.google.com/maps/search/目黒区八雲1-10-8",
    workers: 3,
    category: "ハーフ",
    categoryColor: "slate",
    notes: "午前中のみ、養生必須",
    syncStatus: "synced",
  },
]

// -------------------------------------------------------------------
// Category badge color map
// -------------------------------------------------------------------
const CATEGORY_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-amber-100 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
}

// -------------------------------------------------------------------
// Memo'd table row
// -------------------------------------------------------------------
const ProjectTableRow = memo(function ProjectTableRow({
  row,
}: {
  row: ProjectRow
}) {
  const dayColor =
    row.dayType === "saturday"
      ? "text-blue-600 font-semibold"
      : row.dayType === "sunday"
        ? "text-red-600 font-semibold"
        : "text-slate-700"

  return (
    <TableRow className="group hover:bg-slate-50/80 transition-colors">
      {/* Status */}
      <TableCell className="w-10 text-center">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            row.syncStatus === "synced" ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
          }`}
        />
      </TableCell>

      {/* Date */}
      <TableCell className="whitespace-nowrap">
        <span className={dayColor}>
          {row.date}{" "}
          <span className="text-xs">({row.dayOfWeek})</span>
        </span>
      </TableCell>

      {/* Time */}
      <TableCell className="text-slate-600 font-mono text-sm tabular-nums">
        {row.time}
      </TableCell>

      {/* Client */}
      <TableCell>
        <div className="leading-tight">
          <p className="font-medium text-slate-900 text-sm">{row.clientName}</p>
          <p className="text-xs text-slate-500">{row.contactPerson}</p>
        </div>
      </TableCell>

      {/* Site */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 truncate max-w-[180px]">
            {row.siteAddress}
          </span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={row.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Google Mapsで開く</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>

      {/* Workers */}
      <TableCell className="text-center">
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
          {row.workers}
        </span>
      </TableCell>

      {/* Category */}
      <TableCell>
        <Badge
          variant="outline"
          className={`text-xs font-medium ${CATEGORY_CLASSES[row.categoryColor] || CATEGORY_CLASSES.slate}`}
        >
          {row.category}
        </Badge>
      </TableCell>

      {/* Notes */}
      <TableCell className="max-w-[200px]">
        <span className="text-sm text-slate-500 truncate block">
          {row.notes}
        </span>
      </TableCell>

      {/* Original PDF */}
      <TableCell className="text-center">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600">
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>元FAXを表示</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Menu */}
      <TableCell className="text-center w-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})

// -------------------------------------------------------------------
// Main page component
// -------------------------------------------------------------------
function ProjectsContent() {
  const [month, setMonth] = useState("2026年2月")
  const [search, setSearch] = useState("")
  const [autoSync, setAutoSync] = useState(true)

  const filteredData = MOCK_DATA.filter((row) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      row.clientName.toLowerCase().includes(q) ||
      row.siteAddress.toLowerCase().includes(q) ||
      row.contactPerson.toLowerCase().includes(q)
    )
  })

  const syncedCount = MOCK_DATA.filter((r) => r.syncStatus === "synced").length
  const unsyncedCount = MOCK_DATA.filter((r) => r.syncStatus === "unsynced").length

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
              <Home className="h-3.5 w-3.5" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects" className="text-slate-500 hover:text-slate-700">
              案件管理
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-slate-900 font-medium">{month}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">案件管理台帳</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1 py-0.5">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-slate-700 px-2 min-w-[7rem] text-center">
              {month}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="取引先、現場名で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-64 bg-white"
            />
          </div>

          {/* Filter */}
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            絞り込み
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Auto-sync toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
              className="data-[state=checked]:bg-emerald-600"
            />
            <Label htmlFor="auto-sync" className="text-sm text-slate-600 cursor-pointer">
              自動同期
            </Label>
          </div>

          {/* Spreadsheet export */}
          <div className="flex flex-col items-end">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              スプレッドシートへ書き出し
            </Button>
            <span className="text-[10px] text-slate-400 mt-0.5">Last synced: Just now</span>
          </div>

          {/* Add button */}
          <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            案件を手動登録
          </Button>
        </div>
      </div>

      {/* Sync status summary */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          同期済み: {syncedCount}件
        </span>
        {unsyncedCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            未同期: {unsyncedCount}件
          </span>
        )}
        <span className="text-slate-400">|</span>
        <span>全 {MOCK_DATA.length}件</span>
      </div>

      {/* Data Grid */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-10 text-center text-xs">状態</TableHead>
                <TableHead className="text-xs whitespace-nowrap">日付</TableHead>
                <TableHead className="text-xs whitespace-nowrap">時間</TableHead>
                <TableHead className="text-xs min-w-[160px]">顧客・担当</TableHead>
                <TableHead className="text-xs min-w-[200px]">現場</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap">人工</TableHead>
                <TableHead className="text-xs whitespace-nowrap">区分</TableHead>
                <TableHead className="text-xs">備考</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap">元データ</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <ProjectTableRow key={row.id} row={row} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center text-slate-400">
                    検索条件に一致する案件がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
