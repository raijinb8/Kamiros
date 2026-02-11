"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Calendar as CalendarIcon,
  Search,
  FileSpreadsheet,
  Plus,
  MapPin,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Target,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { toast, Toaster } from "sonner"

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
interface ProjectRow {
  id: string
  time: string
  clientName: string
  contactPerson: string
  siteAddress: string
  mapUrl: string
  workers: number
  category: string
  categoryColor: "blue" | "orange" | "slate" | "emerald" | "rose"
  receivedDate: string
  notes: string
  pdfUrl: string | null
  syncStatus: "synced" | "unsynced"
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------
const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"] as const

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getDayName(year: number, month: number, day: number): string {
  return DAY_NAMES[new Date(year, month, day).getDay()]
}

function getDayType(year: number, month: number, day: number): "weekday" | "saturday" | "sunday" {
  const dow = new Date(year, month, day).getDay()
  if (dow === 0) return "sunday"
  if (dow === 6) return "saturday"
  return "weekday"
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// -------------------------------------------------------------------
// Mock data keyed by date string
// -------------------------------------------------------------------
const DAILY_DATA: Record<string, ProjectRow[]> = {
  "2026-02-01": [
    { id: "1-1", time: "08:00", clientName: "佐久間建設", contactPerson: "佐久間様", siteAddress: "川口市並木2-10-5", mapUrl: "https://www.google.com/maps/search/川口市並木2-10-5", workers: 2, category: "常用", categoryColor: "blue", receivedDate: "1/15", notes: "ヘルメット持参", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "1-2", time: "09:30", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 1, category: "内装材", categoryColor: "rose", receivedDate: "1/18", notes: "午前のみ", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-02": [
    { id: "2-1", time: "08:00", clientName: "田中建設", contactPerson: "田中様", siteAddress: "さいたま市浦和区高砂3-1", mapUrl: "https://www.google.com/maps/search/さいたま市浦和区高砂3-1", workers: 3, category: "常用", categoryColor: "blue", receivedDate: "1/25", notes: "2名手元、1名解体", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "2-2", time: "09:00", clientName: "鈴木工務店", contactPerson: "佐藤様", siteAddress: "戸田市喜沢南1-5-12", mapUrl: "https://www.google.com/maps/search/戸田市喜沢南1-5-12", workers: 2, category: "手間", categoryColor: "orange", receivedDate: "1/26", notes: "駐車場なし", pdfUrl: null, syncStatus: "unsynced" },
    { id: "2-3", time: "10:30", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市神奈川区六角橋2-8", mapUrl: "https://www.google.com/maps/search/横浜市神奈川区六角橋2-8", workers: 1, category: "UB", categoryColor: "emerald", receivedDate: "1/27", notes: "AG3・HM3", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "2-4", time: "13:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "目黒区八雲1-10-8", mapUrl: "https://www.google.com/maps/search/目黒区八雲1-10-8", workers: 2, category: "ハーフ", categoryColor: "slate", receivedDate: "1/28", notes: "午後開始、養生必須", pdfUrl: null, syncStatus: "synced" },
    { id: "2-5", time: "14:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", receivedDate: "1/29", notes: "", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-03": [
    { id: "3-1", time: "08:00", clientName: "(株)山田工務店", contactPerson: "鈴木担当", siteAddress: "戸田市喜沢南1-5-12", mapUrl: "https://www.google.com/maps/search/戸田市喜沢南1-5-12", workers: 4, category: "常用", categoryColor: "blue", receivedDate: "1/20", notes: "2名手元、2名解体", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "3-2", time: "08:30", clientName: "株式会社アクティブ", contactPerson: "田中様", siteAddress: "川口市並木2-10", mapUrl: "https://www.google.com/maps/search/川口市並木2-10", workers: 2, category: "常用", categoryColor: "blue", receivedDate: "1/22", notes: "ヘルメット持参", pdfUrl: null, syncStatus: "synced" },
    { id: "3-3", time: "09:00", clientName: "鈴木建設", contactPerson: "佐藤様", siteAddress: "さいたま市浦和区高砂3-1", mapUrl: "https://www.google.com/maps/search/さいたま市浦和区高砂3-1", workers: 1, category: "手間", categoryColor: "orange", receivedDate: "1/23", notes: "駐車場なし、近隣コインP利用", pdfUrl: "/sample-fax.pdf", syncStatus: "unsynced" },
    { id: "3-4", time: "10:00", clientName: "大和ハウス工業", contactPerson: "中田様", siteAddress: "板橋区成増3-12-1", mapUrl: "https://www.google.com/maps/search/板橋区成増3-12-1", workers: 3, category: "常用", categoryColor: "blue", receivedDate: "1/25", notes: "終日作業", pdfUrl: null, syncStatus: "synced" },
    { id: "3-5", time: "13:00", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市神奈川区六角橋2-8", mapUrl: "https://www.google.com/maps/search/横浜市神奈川区六角橋2-8", workers: 1, category: "UB", categoryColor: "emerald", receivedDate: "1/24", notes: "AG3・HM3", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "3-6", time: "14:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "目黒区八雲1-10-8", mapUrl: "https://www.google.com/maps/search/目黒区八雲1-10-8", workers: 3, category: "ハーフ", categoryColor: "slate", receivedDate: "1/26", notes: "午前中のみ、養生必須", pdfUrl: null, syncStatus: "synced" },
    { id: "3-7", time: "15:00", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 2, category: "内装材", categoryColor: "rose", receivedDate: "1/27", notes: "", pdfUrl: null, syncStatus: "synced" },
    { id: "3-8", time: "16:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", receivedDate: "1/28", notes: "搬入のみ", pdfUrl: "/sample-fax.pdf", syncStatus: "unsynced" },
  ],
  "2026-02-04": [
    { id: "4-1", time: "08:00", clientName: "富士建材", contactPerson: "石川様", siteAddress: "文京区本郷3-2-7", mapUrl: "https://www.google.com/maps/search/文京区本郷3-2-7", workers: 2, category: "常用", categoryColor: "blue", receivedDate: "1/30", notes: "午前中", pdfUrl: null, syncStatus: "synced" },
    { id: "4-2", time: "13:00", clientName: "田中建設", contactPerson: "田中様", siteAddress: "北区赤羽1-50-11", mapUrl: "https://www.google.com/maps/search/北区赤羽1-50-11", workers: 3, category: "手間", categoryColor: "orange", receivedDate: "2/1", notes: "午後開始", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
  ],
  "2026-02-05": [
    { id: "5-1", time: "08:00", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 2, category: "内装材", categoryColor: "rose", receivedDate: "1/28", notes: "終日作業", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "5-2", time: "09:30", clientName: "鈴木工務店", contactPerson: "佐藤様", siteAddress: "川口市幸町1-7", mapUrl: "https://www.google.com/maps/search/川口市幸町1-7", workers: 1, category: "常用", categoryColor: "blue", receivedDate: "1/30", notes: "", pdfUrl: null, syncStatus: "unsynced" },
    { id: "5-3", time: "14:00", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市港北区日吉5-1", mapUrl: "https://www.google.com/maps/search/横浜市港北区日吉5-1", workers: 2, category: "UB", categoryColor: "emerald", receivedDate: "2/1", notes: "AG3", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-10": [
    { id: "10-1", time: "08:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "新宿区西新宿2-8-1", mapUrl: "https://www.google.com/maps/search/新宿区西新宿2-8-1", workers: 4, category: "常用", categoryColor: "blue", receivedDate: "2/3", notes: "4名全員手元", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "10-2", time: "09:00", clientName: "大和ハウス工業", contactPerson: "中田様", siteAddress: "渋谷区道玄坂1-12", mapUrl: "https://www.google.com/maps/search/渋谷区道玄坂1-12", workers: 2, category: "ハーフ", categoryColor: "slate", receivedDate: "2/5", notes: "午前のみ", pdfUrl: null, syncStatus: "synced" },
    { id: "10-3", time: "13:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", receivedDate: "2/6", notes: "", pdfUrl: null, syncStatus: "unsynced" },
  ],
}

// -------------------------------------------------------------------
// Daily Performance Metrics keyed by date
// -------------------------------------------------------------------
interface DailyMetrics {
  target: number
  totalOrders: number
  am: number
  pm: number
  night: number
  gold: number
  freely: number
  other: number
  confirmed: number
  unconfirmed: number
}

const DAILY_METRICS: Record<string, DailyMetrics> = {
  "2026-02-01": { target: 5, totalOrders: 3, am: 2, pm: 3, night: 0, gold: 1, freely: 2, other: 0, confirmed: 3, unconfirmed: 0 },
  "2026-02-02": { target: 12, totalOrders: 9, am: 6, pm: 9, night: 0, gold: 2, freely: 6, other: 1, confirmed: 7, unconfirmed: 2 },
  "2026-02-03": { target: 40, totalOrders: 45, am: 42, pm: 45, night: 3, gold: 6, freely: 38, other: 1, confirmed: 43, unconfirmed: 2 },
  "2026-02-04": { target: 10, totalOrders: 5, am: 2, pm: 5, night: 0, gold: 1, freely: 4, other: 0, confirmed: 4, unconfirmed: 1 },
  "2026-02-05": { target: 10, totalOrders: 5, am: 3, pm: 5, night: 0, gold: 1, freely: 3, other: 1, confirmed: 5, unconfirmed: 0 },
  "2026-02-10": { target: 15, totalOrders: 7, am: 6, pm: 7, night: 0, gold: 2, freely: 4, other: 1, confirmed: 5, unconfirmed: 2 },
}

const CATEGORY_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-amber-100 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
}

// -------------------------------------------------------------------
// Memo'd Table Row
// -------------------------------------------------------------------
const DailyTableRow = memo(function DailyTableRow({ row }: { row: ProjectRow }) {
  return (
    <TableRow className="group hover:bg-slate-50/80">
      {/* Time */}
      <TableCell className="font-mono text-sm tabular-nums text-slate-700">{row.time}</TableCell>

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
          <span className="text-sm text-slate-700 truncate max-w-[200px]">{row.siteAddress}</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={row.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top"><p>Google Mapsで開く</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>

      {/* Workers */}
      <TableCell className="text-center">
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5">{row.workers}</Badge>
      </TableCell>

      {/* Category */}
      <TableCell>
        <Badge variant="outline" className={`text-xs font-medium ${CATEGORY_CLASSES[row.categoryColor] || CATEGORY_CLASSES.slate}`}>
          {row.category}
        </Badge>
      </TableCell>

      {/* Received Date */}
      <TableCell className="text-sm text-slate-400">{row.receivedDate}</TableCell>

      {/* Notes */}
      <TableCell className="max-w-[180px]">
        <span className="text-sm text-slate-500 truncate block">{row.notes || "-"}</span>
      </TableCell>

      {/* Original PDF */}
      <TableCell className="text-center">
        {row.pdfUrl ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700">
                    <FileText className="h-4 w-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side="top"><p>元FAXを表示</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </TableCell>

      {/* Sync Status */}
      <TableCell className="text-center">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          row.syncStatus === "synced" ? "text-emerald-600" : "text-slate-400"
        }`}>
          <span className={`h-2 w-2 rounded-full ${row.syncStatus === "synced" ? "bg-emerald-500" : "bg-slate-300"}`} />
          {row.syncStatus === "synced" ? "OK" : "未"}
        </span>
      </TableCell>

      {/* Menu */}
      <TableCell className="text-center w-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />編集</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})

// -------------------------------------------------------------------
// Date Tab Button
// -------------------------------------------------------------------
const DateTab = memo(function DateTab({
  day,
  dayName,
  dayType,
  isSelected,
  hasData,
  onSelect,
}: {
  day: number
  dayName: string
  dayType: "weekday" | "saturday" | "sunday"
  isSelected: boolean
  hasData: boolean
  onSelect: (day: number) => void
}) {
  const textColor = dayType === "sunday" ? "text-red-600" : dayType === "saturday" ? "text-blue-600" : "text-slate-600"

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      className={`relative flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg px-2 transition-colors shrink-0 ${
        isSelected
          ? "bg-blue-600 text-white shadow-sm"
          : `bg-white hover:bg-slate-100 border border-slate-200 ${textColor}`
      }`}
    >
      <span className={`text-base font-bold leading-none ${isSelected ? "text-white" : ""}`}>{day}</span>
      <span className={`text-[10px] leading-none mt-0.5 ${isSelected ? "text-blue-100" : ""}`}>{dayName}</span>
      {hasData && !isSelected && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </button>
  )
})

// -------------------------------------------------------------------
// Main Page Component
// -------------------------------------------------------------------
function ProjectsContent() {
  const [year] = useState(2026)
  const [month] = useState(1) // 0-indexed: January=0, February=1
  const [selectedDay, setSelectedDay] = useState(3)
  const [search, setSearch] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedTabRef = useRef<HTMLDivElement>(null)

  const daysInMonth = getDaysInMonth(year, month)

  // Scroll to selected tab
  useEffect(() => {
    if (selectedTabRef.current) {
      selectedTabRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [selectedDay])

  const handleSelectDay = useCallback((day: number) => {
    setSelectedDay(day)
    setSearch("")
  }, [])

  const handleCalendarSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDay(date.getDate())
      setCalendarOpen(false)
    }
  }, [])

  const key = dateKey(year, month, selectedDay)
  const currentData = DAILY_DATA[key] || []
  const metrics = DAILY_METRICS[key] || null
  const totalWorkers = currentData.reduce((sum, r) => sum + r.workers, 0)
  const targetMet = metrics ? metrics.totalOrders >= metrics.target : false

  const handleSync = useCallback(() => {
    setIsSyncing(true)
    const rowCount = (DAILY_DATA[dateKey(year, month, selectedDay)] || []).length
    setTimeout(() => {
      setIsSyncing(false)
      toast.success(`${month + 1}/${selectedDay}のデータをシートに書き込みました`, {
        description: `${rowCount}件の案件を同期しました`,
      })
    }, 1200)
  }, [year, month, selectedDay])

  const filteredData = search
    ? currentData.filter((r) => {
        const q = search.toLowerCase()
        return r.clientName.toLowerCase().includes(q) || r.siteAddress.toLowerCase().includes(q) || r.contactPerson.toLowerCase().includes(q)
      })
    : currentData

  return (
    <div className="space-y-0">
      <Toaster position="top-right" richColors />

      {/* Section 1: Month/Year + Calendar Picker */}
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {year}年 {month + 1}月
        </h1>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <CalendarIcon className="h-4 w-4" />
              日付を選択
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(year, month, selectedDay)}
              onSelect={handleCalendarSelect}
              defaultMonth={new Date(year, month)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Section 2: Horizontal Date Strip (Sheet Tabs) */}
      <div className="mb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div ref={scrollRef} className="flex gap-1.5 pb-2 px-0.5">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dk = dateKey(year, month, day)
              return (
                <div key={day} ref={day === selectedDay ? selectedTabRef : undefined}>
                  <DateTab
                    day={day}
                    dayName={getDayName(year, month, day)}
                    dayType={getDayType(year, month, day)}
                    isSelected={day === selectedDay}
                    hasData={!!DAILY_DATA[dk]}
                    onSelect={handleSelectDay}
                  />
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Section 3: Daily Performance Panel */}
      {metrics ? (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-900 text-white p-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Group A: Total Orders vs Target */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium leading-none mb-1">
                  総受注 (Target: {metrics.target})
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold tabular-nums leading-none ${targetMet ? "text-emerald-400" : "text-orange-400"}`}>
                    {metrics.totalOrders}
                  </span>
                  {targetMet ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">達成</Badge>
                  ) : (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] px-1.5 py-0">
                      未達 ({metrics.target - metrics.totalOrders})
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 bg-slate-700" />

            {/* Group B: Time Breakdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800">
                <Clock className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">AM</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-slate-100">{metrics.am}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">PM</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-slate-100">{metrics.pm}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">夜間</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-slate-100">{metrics.night}</p>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 bg-slate-700" />

            {/* Group C: Staff Categories */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-amber-400 uppercase tracking-wider">ゴールド</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-amber-300">{metrics.gold}</p>
                </div>
                <div>
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider">フリーリー</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-blue-300">{metrics.freely}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">その他</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-slate-300">{metrics.other}</p>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 bg-slate-700" />

            {/* Group D: Staffing Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800">
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                {metrics.unconfirmed > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
                    <div>
                      <p className="text-[10px] text-orange-400 uppercase tracking-wider">未確定</p>
                      <p className="text-lg font-bold tabular-nums leading-none text-orange-400">{metrics.unconfirmed}件</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">未確定</p>
                    <p className="text-lg font-bold tabular-nums leading-none text-slate-500">0件</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider">確定済</p>
                  <p className="text-lg font-bold tabular-nums leading-none text-emerald-400">{metrics.confirmed}件</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
          この日の受注管理データはありません
        </div>
      )}

      {/* Section 4: Action Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-52 bg-white"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
          スプシ同期
        </Button>
        <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          案件登録
        </Button>
      </div>

      {/* Section 5: Daily Data Grid */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="text-xs whitespace-nowrap w-16">時間</TableHead>
                <TableHead className="text-xs min-w-[160px]">顧客・担当</TableHead>
                <TableHead className="text-xs min-w-[220px]">現場</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-14">人工</TableHead>
                <TableHead className="text-xs whitespace-nowrap w-20">区分</TableHead>
                <TableHead className="text-xs whitespace-nowrap w-16">依頼日</TableHead>
                <TableHead className="text-xs">備考</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-14">原本</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-14">同期</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => <DailyTableRow key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CalendarIcon className="h-8 w-8 text-slate-300" />
                      <p className="text-sm">
                        {search
                          ? "検索条件に一致する案件がありません"
                          : `${month + 1}/${selectedDay} の案件データはありません`}
                      </p>
                    </div>
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
