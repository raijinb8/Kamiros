"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Calendar as CalendarIcon, Search, FileSpreadsheet, Plus, MapPin, FileText,
  Pencil, Loader2, Clock, Users, Sun, Moon, AlertTriangle, CheckCircle,
} from "lucide-react"
import { toast, Toaster } from "sonner"

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
type AssignType = "Active" | "AG" | "AF" | "AA" | "HM" | "Omusubi"

// Granular time slot labels
const TIME_SLOTS = ["early", "08:00", "10:00", "13:00", "14:00", "15:00", "16:00", "night"] as const
type TimeSlot = typeof TIME_SLOTS[number]

const SLOT_LABELS: Record<TimeSlot, string> = {
  early: "早朝", "08:00": "8:00~", "10:00": "10:00~", "13:00": "13:00~",
  "14:00": "14:00~", "15:00": "15:00~", "16:00": "16:00~", night: "夜間",
}

interface ProjectRow {
  id: string
  time: string
  slot: TimeSlot
  clientName: string
  contactPerson: string
  siteAddress: string
  mapUrl: string
  workers: number
  category: string
  categoryColor: "blue" | "orange" | "slate" | "emerald" | "rose"
  assign: AssignType
  receivedDate: string
  notes: string
  pdfUrl: string | null
  syncStatus: "synced" | "unsynced"
}

interface ShiftSupply {
  am: number
  pm: number
}

// -------------------------------------------------------------------
// Assign badge config
// -------------------------------------------------------------------
const ASSIGN_CONFIG: Record<AssignType, { label: string; className: string }> = {
  Active:  { label: "Active", className: "bg-slate-100 text-slate-700 border-slate-300" },
  AG:      { label: "AG",     className: "bg-amber-100 text-amber-800 border-amber-300" },
  AF:      { label: "AF",     className: "bg-blue-100 text-blue-800 border-blue-300" },
  AA:      { label: "AA",     className: "bg-purple-100 text-purple-800 border-purple-300" },
  HM:      { label: "HM",     className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  Omusubi: { label: "\u{1F359}", className: "bg-orange-100 text-orange-800 border-orange-300" },
}

const CATEGORY_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-amber-100 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
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

function slotSortKey(slot: TimeSlot): number {
  return TIME_SLOTS.indexOf(slot)
}

function isAmSlot(slot: TimeSlot): boolean {
  return slot === "early" || slot === "08:00" || slot === "10:00"
}

// -------------------------------------------------------------------
// Shift Supply (workers available from Shift DB)
// -------------------------------------------------------------------
const DAILY_SHIFT_SUPPLY: Record<string, ShiftSupply> = {
  "2026-02-01": { am: 10, pm: 8 },
  "2026-02-02": { am: 25, pm: 20 },
  "2026-02-03": { am: 40, pm: 35 },  // PM shortage scenario
  "2026-02-04": { am: 12, pm: 10 },
  "2026-02-05": { am: 15, pm: 12 },
  "2026-02-10": { am: 20, pm: 18 },
}

// -------------------------------------------------------------------
// Mock data: 2/3 has PM Shortage Alert scenario
// AM: 38 assigned workers (Safe, <= 40 available)
// PM: 42 assigned workers (DANGER, > 35 available)
// -------------------------------------------------------------------
const DAILY_DATA: Record<string, ProjectRow[]> = {
  "2026-02-01": [
    { id: "1-1", slot: "08:00", time: "08:00", clientName: "佐久間建設", contactPerson: "佐久間様", siteAddress: "川口市並木2-10-5", mapUrl: "https://www.google.com/maps/search/川口市並木2-10-5", workers: 2, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/15", notes: "ヘルメット持参", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "1-2", slot: "10:00", time: "10:00", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 1, category: "内装材", categoryColor: "rose", assign: "AG", receivedDate: "1/18", notes: "午前のみ", pdfUrl: null, syncStatus: "synced" },
    { id: "1-3", slot: "13:00", time: "13:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/20", notes: "", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-02": [
    { id: "2-1", slot: "08:00", time: "08:00", clientName: "田中建設", contactPerson: "田中様", siteAddress: "さいたま市浦和区高砂3-1", mapUrl: "https://www.google.com/maps/search/さいたま市浦和区高砂3-1", workers: 3, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/25", notes: "2名手元、1名解体", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "2-2", slot: "10:00", time: "10:00", clientName: "鈴木工務店", contactPerson: "佐藤様", siteAddress: "戸田市喜沢南1-5-12", mapUrl: "https://www.google.com/maps/search/戸田市喜沢南1-5-12", workers: 2, category: "手間", categoryColor: "orange", assign: "AF", receivedDate: "1/26", notes: "駐車場なし", pdfUrl: null, syncStatus: "unsynced" },
    { id: "2-3", slot: "10:00", time: "10:30", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市神奈川区六角橋2-8", mapUrl: "https://www.google.com/maps/search/横浜市神奈川区六角橋2-8", workers: 1, category: "UB", categoryColor: "emerald", assign: "HM", receivedDate: "1/27", notes: "AG3・HM3", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "2-4", slot: "13:00", time: "13:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "目黒区八雲1-10-8", mapUrl: "https://www.google.com/maps/search/目黒区八雲1-10-8", workers: 2, category: "ハーフ", categoryColor: "slate", assign: "Active", receivedDate: "1/28", notes: "午後開始、養生必須", pdfUrl: null, syncStatus: "synced" },
    { id: "2-5", slot: "14:00", time: "14:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", assign: "Omusubi", receivedDate: "1/29", notes: "", pdfUrl: null, syncStatus: "synced" },
  ],
  // 2/3: PM Shortage Alert - AM assigned=38 (supply=40 Safe), PM assigned=42 (supply=35 DANGER)
  "2026-02-03": [
    // --- AM block: 8 orders, 38 workers total ---
    { id: "3-1", slot: "early", time: "06:30", clientName: "早朝建材(株)", contactPerson: "早川様", siteAddress: "足立区千住1-4", mapUrl: "https://www.google.com/maps/search/足立区千住1-4", workers: 3, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/18", notes: "早朝搬入", pdfUrl: null, syncStatus: "synced" },
    { id: "3-2", slot: "08:00", time: "08:00", clientName: "(株)山田工務店", contactPerson: "鈴木担当", siteAddress: "戸田市喜沢南1-5-12", mapUrl: "https://www.google.com/maps/search/戸田市喜沢南1-5-12", workers: 6, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/20", notes: "4名手元、2名解体", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "3-3", slot: "08:00", time: "08:00", clientName: "富士建材", contactPerson: "石川様", siteAddress: "文京区本郷3-2-7", mapUrl: "https://www.google.com/maps/search/文京区本郷3-2-7", workers: 4, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/22", notes: "終日", pdfUrl: null, syncStatus: "synced" },
    { id: "3-4", slot: "08:00", time: "08:30", clientName: "株式会社アクティブ", contactPerson: "田中様", siteAddress: "川口市並木2-10", mapUrl: "https://www.google.com/maps/search/川口市並木2-10", workers: 3, category: "常用", categoryColor: "blue", assign: "AG", receivedDate: "1/23", notes: "ヘルメット持参", pdfUrl: null, syncStatus: "synced" },
    { id: "3-5", slot: "10:00", time: "10:00", clientName: "大和ハウス工業", contactPerson: "中田様", siteAddress: "板橋区成増3-12-1", mapUrl: "https://www.google.com/maps/search/板橋区成増3-12-1", workers: 8, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/25", notes: "終日作業、大型搬入あり", pdfUrl: null, syncStatus: "synced" },
    { id: "3-6", slot: "10:00", time: "10:00", clientName: "鈴木建設", contactPerson: "佐藤様", siteAddress: "さいたま市浦和区高砂3-1", mapUrl: "https://www.google.com/maps/search/さいたま市浦和区高砂3-1", workers: 5, category: "手間", categoryColor: "orange", assign: "AG", receivedDate: "1/24", notes: "駐車場なし", pdfUrl: "/sample-fax.pdf", syncStatus: "unsynced" },
    { id: "3-7", slot: "10:00", time: "10:00", clientName: "三井住友建設", contactPerson: "大塚様", siteAddress: "千代田区丸の内1-1", mapUrl: "https://www.google.com/maps/search/千代田区丸の内1-1", workers: 5, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/26", notes: "大型搬入あり", pdfUrl: null, syncStatus: "synced" },
    { id: "3-8", slot: "10:00", time: "10:30", clientName: "中野建工", contactPerson: "中野様", siteAddress: "中野区中央4-1", mapUrl: "https://www.google.com/maps/search/中野区中央4-1", workers: 4, category: "UB", categoryColor: "emerald", assign: "Active", receivedDate: "1/27", notes: "", pdfUrl: null, syncStatus: "synced" },
    // --- PM block: 7 orders, 42 workers total (EXCEEDS 35 supply!) ---
    { id: "3-9", slot: "13:00", time: "13:00", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市神奈川区六角橋2-8", mapUrl: "https://www.google.com/maps/search/横浜市神奈川区六角橋2-8", workers: 8, category: "UB", categoryColor: "emerald", assign: "Active", receivedDate: "1/24", notes: "AG3・HM3", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "3-10", slot: "13:00", time: "13:00", clientName: "東急建設(株)", contactPerson: "斉藤様", siteAddress: "渋谷区桜丘町26-1", mapUrl: "https://www.google.com/maps/search/渋谷区桜丘町26-1", workers: 6, category: "常用", categoryColor: "blue", assign: "AF", receivedDate: "1/28", notes: "午後開始", pdfUrl: null, syncStatus: "synced" },
    { id: "3-11", slot: "14:00", time: "14:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "目黒区八雲1-10-8", mapUrl: "https://www.google.com/maps/search/目黒区八雲1-10-8", workers: 7, category: "ハーフ", categoryColor: "slate", assign: "Active", receivedDate: "1/26", notes: "養生必須", pdfUrl: null, syncStatus: "synced" },
    { id: "3-12", slot: "15:00", time: "15:00", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 5, category: "内装材", categoryColor: "rose", assign: "Active", receivedDate: "1/27", notes: "", pdfUrl: null, syncStatus: "synced" },
    { id: "3-13", slot: "15:00", time: "15:30", clientName: "横浜港運(株)", contactPerson: "松田様", siteAddress: "横浜市中区海岸通1", mapUrl: "https://www.google.com/maps/search/横浜市中区海岸通1", workers: 6, category: "常用", categoryColor: "blue", assign: "Omusubi", receivedDate: "1/29", notes: "倉庫搬入", pdfUrl: null, syncStatus: "synced" },
    { id: "3-14", slot: "16:00", time: "16:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 5, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/28", notes: "搬入のみ", pdfUrl: "/sample-fax.pdf", syncStatus: "unsynced" },
    { id: "3-15", slot: "16:00", time: "16:30", clientName: "夕方建材", contactPerson: "山本様", siteAddress: "豊島区東池袋3-1", mapUrl: "https://www.google.com/maps/search/豊島区東池袋3-1", workers: 5, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/30", notes: "夕方搬入", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-04": [
    { id: "4-1", slot: "08:00", time: "08:00", clientName: "富士建材", contactPerson: "石川様", siteAddress: "文京区本郷3-2-7", mapUrl: "https://www.google.com/maps/search/文京区本郷3-2-7", workers: 2, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "1/30", notes: "午前中", pdfUrl: null, syncStatus: "synced" },
    { id: "4-2", slot: "13:00", time: "13:00", clientName: "田中建設", contactPerson: "田中様", siteAddress: "北区赤羽1-50-11", mapUrl: "https://www.google.com/maps/search/北区赤羽1-50-11", workers: 3, category: "手間", categoryColor: "orange", assign: "AA", receivedDate: "2/1", notes: "午後開始", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
  ],
  "2026-02-05": [
    { id: "5-1", slot: "08:00", time: "08:00", clientName: "大成木材", contactPerson: "島田様", siteAddress: "世田谷区代田4-2-6", mapUrl: "https://www.google.com/maps/search/世田谷区代田4-2-6", workers: 2, category: "内装材", categoryColor: "rose", assign: "Active", receivedDate: "1/28", notes: "終日作業", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "5-2", slot: "10:00", time: "10:00", clientName: "鈴木工務店", contactPerson: "佐藤様", siteAddress: "川口市幸町1-7", mapUrl: "https://www.google.com/maps/search/川口市幸町1-7", workers: 1, category: "常用", categoryColor: "blue", assign: "HM", receivedDate: "1/30", notes: "", pdfUrl: null, syncStatus: "unsynced" },
    { id: "5-3", slot: "14:00", time: "14:00", clientName: "ジューテック開発", contactPerson: "稲村様", siteAddress: "横浜市港北区日吉5-1", mapUrl: "https://www.google.com/maps/search/横浜市港北区日吉5-1", workers: 2, category: "UB", categoryColor: "emerald", assign: "Active", receivedDate: "2/1", notes: "AG3", pdfUrl: null, syncStatus: "synced" },
  ],
  "2026-02-10": [
    { id: "10-1", slot: "08:00", time: "08:00", clientName: "加藤ベニヤ本社", contactPerson: "高橋様", siteAddress: "新宿区西新宿2-8-1", mapUrl: "https://www.google.com/maps/search/新宿区西新宿2-8-1", workers: 4, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "2/3", notes: "4名全員手元", pdfUrl: "/sample-fax.pdf", syncStatus: "synced" },
    { id: "10-2", slot: "10:00", time: "10:00", clientName: "大和ハウス工業", contactPerson: "中田様", siteAddress: "渋谷区道玄坂1-12", mapUrl: "https://www.google.com/maps/search/渋谷区道玄坂1-12", workers: 2, category: "ハーフ", categoryColor: "slate", assign: "AF", receivedDate: "2/5", notes: "午前のみ", pdfUrl: null, syncStatus: "synced" },
    { id: "10-3", slot: "13:00", time: "13:00", clientName: "中央設備", contactPerson: "木村様", siteAddress: "練馬区豊玉北5-3", mapUrl: "https://www.google.com/maps/search/練馬区豊玉北5-3", workers: 1, category: "常用", categoryColor: "blue", assign: "Active", receivedDate: "2/6", notes: "", pdfUrl: null, syncStatus: "unsynced" },
  ],
}

// -------------------------------------------------------------------
// Compute metrics from data
// -------------------------------------------------------------------
function computeMetrics(data: ProjectRow[], supply: ShiftSupply | null) {
  const slotCounts: Record<TimeSlot, number> = { early: 0, "08:00": 0, "10:00": 0, "13:00": 0, "14:00": 0, "15:00": 0, "16:00": 0, night: 0 }
  const outsourced: Record<string, number> = { AG: 0, AF: 0, AA: 0, HM: 0, Omusubi: 0 }
  let amWorkers = 0, pmWorkers = 0

  for (const row of data) {
    slotCounts[row.slot]++
    if (isAmSlot(row.slot)) amWorkers += row.workers
    else pmWorkers += row.workers
    if (row.assign !== "Active" && row.assign in outsourced) outsourced[row.assign]++
  }

  const totalOutsourced = Object.values(outsourced).reduce((a, b) => a + b, 0)
  const amAvailable = supply?.am ?? 0
  const pmAvailable = supply?.pm ?? 0

  return {
    totalOrders: data.length,
    slotCounts,
    outsourced,
    totalOutsourced,
    activeInternal: data.length - totalOutsourced,
    amWorkers, pmWorkers,
    amAvailable, pmAvailable,
    amShortage: amWorkers > amAvailable,
    pmShortage: pmWorkers > pmAvailable,
  }
}

// -------------------------------------------------------------------
// Memo'd Table Row
// -------------------------------------------------------------------
const DailyTableRow = memo(function DailyTableRow({
  row, onEdit,
}: {
  row: ProjectRow
  onEdit: (row: ProjectRow) => void
}) {
  const assignCfg = ASSIGN_CONFIG[row.assign]
  return (
    <TableRow className="group hover:bg-slate-50/80">
      <TableCell className="font-mono text-sm tabular-nums text-slate-700">{row.time}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs font-medium ${assignCfg.className}`}>
          {assignCfg.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="leading-tight">
          <p className="font-medium text-slate-900 text-sm">{row.clientName}</p>
          <p className="text-xs text-slate-500">{row.contactPerson}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 truncate max-w-[200px]">{row.siteAddress}</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={row.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top"><p>Google Mapsで開く</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5">{row.workers}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs font-medium ${CATEGORY_CLASSES[row.categoryColor] || CATEGORY_CLASSES.slate}`}>
          {row.category}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-slate-400">{row.receivedDate}</TableCell>
      <TableCell className="max-w-[150px]">
        <span className="text-sm text-slate-500 truncate block">{row.notes || "-"}</span>
      </TableCell>
      <TableCell className="text-center">
        {row.pdfUrl ? (
          <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"><FileText className="h-4 w-4" /></Button>
          </a>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600" onClick={() => onEdit(row)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

// -------------------------------------------------------------------
// Date Tab Button
// -------------------------------------------------------------------
const DateTab = memo(function DateTab({
  day, dayName, dayType, isSelected, hasData, onSelect,
}: {
  day: number; dayName: string; dayType: "weekday" | "saturday" | "sunday"; isSelected: boolean; hasData: boolean; onSelect: (day: number) => void
}) {
  const textColor = dayType === "sunday" ? "text-red-600" : dayType === "saturday" ? "text-blue-600" : "text-slate-600"
  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      className={`relative flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg px-2 transition-colors shrink-0 ${
        isSelected ? "bg-blue-600 text-white shadow-sm" : `bg-white hover:bg-slate-100 border border-slate-200 ${textColor}`
      }`}
    >
      <span className={`text-base font-bold leading-none ${isSelected ? "text-white" : ""}`}>{day}</span>
      <span className={`text-[10px] leading-none mt-0.5 ${isSelected ? "text-blue-100" : ""}`}>{dayName}</span>
      {hasData && !isSelected && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-400" />}
    </button>
  )
})

// -------------------------------------------------------------------
// Edit Dialog
// -------------------------------------------------------------------
function EditDialog({
  row, open, onOpenChange, onSave,
}: {
  row: ProjectRow; open: boolean; onOpenChange: (v: boolean) => void; onSave: (updated: ProjectRow) => void
}) {
  const [form, setForm] = useState<ProjectRow>(row)
  const update = <K extends keyof ProjectRow>(field: K, value: ProjectRow[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>案件情報の編集</DialogTitle>
          <DialogDescription>案件の詳細を変更してください。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">日付</Label>
              <Input value={form.receivedDate} readOnly className="bg-slate-50 text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">時間</Label>
              <Input value={form.time} onChange={(e) => update("time", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">発注先 (Assign)</Label>
            <Select value={form.assign} onValueChange={(v) => update("assign", v as AssignType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active (自社)</SelectItem>
                <SelectItem value="AG">AG (Gold)</SelectItem>
                <SelectItem value="AF">AF (Freely)</SelectItem>
                <SelectItem value="AA">AA (Ace)</SelectItem>
                <SelectItem value="HM">HM (House)</SelectItem>
                <SelectItem value="Omusubi">{"\u{1F359}"} (Omusubi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">顧客名</Label>
              <Input value={form.clientName} onChange={(e) => update("clientName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">担当者</Label>
              <Input value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">現場住所</Label>
              <Input value={form.siteAddress} onChange={(e) => update("siteAddress", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">地図URL</Label>
              <Input value={form.mapUrl} onChange={(e) => update("mapUrl", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">人工</Label>
              <Input type="number" min={1} value={form.workers} onChange={(e) => update("workers", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">区分</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="常用">常用</SelectItem>
                  <SelectItem value="手間">手間</SelectItem>
                  <SelectItem value="ハーフ">ハーフ</SelectItem>
                  <SelectItem value="UB">UB</SelectItem>
                  <SelectItem value="内装材">内装材</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">備考</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>キャンセル</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { onSave(form); onOpenChange(false) }}>変更を保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------------
// Utilization Bar (mini component for the panel)
// -------------------------------------------------------------------
function UtilBar({ assigned, available, isShortage }: { assigned: number; available: number; isShortage: boolean }) {
  const pct = available > 0 ? Math.min((assigned / available) * 100, 100) : 0
  return (
    <div className="w-full mt-1.5">
      <Progress
        value={pct}
        className={`h-2 ${isShortage ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"}`}
      />
      <p className="text-[9px] text-slate-500 mt-0.5 text-right tabular-nums">
        {Math.round(pct)}% 稼働率
      </p>
    </div>
  )
}

// -------------------------------------------------------------------
// Main Page Component
// -------------------------------------------------------------------
function ProjectsContent() {
  const [year] = useState(2026)
  const [month] = useState(1)
  const [selectedDay, setSelectedDay] = useState(3)
  const [search, setSearch] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [editRow, setEditRow] = useState<ProjectRow | null>(null)
  const [dataStore, setDataStore] = useState(DAILY_DATA)

  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedTabRef = useRef<HTMLDivElement>(null)
  const daysInMonth = getDaysInMonth(year, month)

  useEffect(() => {
    if (selectedTabRef.current) {
      selectedTabRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [selectedDay])

  const handleSelectDay = useCallback((day: number) => { setSelectedDay(day); setSearch("") }, [])
  const handleCalendarSelect = useCallback((date: Date | undefined) => { if (date) { setSelectedDay(date.getDate()); setCalendarOpen(false) } }, [])
  const handleEdit = useCallback((row: ProjectRow) => { setEditRow(row) }, [])

  const handleSave = useCallback((updated: ProjectRow) => {
    setDataStore((prev) => {
      const copy = { ...prev }
      for (const [dk, rows] of Object.entries(copy)) {
        const idx = rows.findIndex((r) => r.id === updated.id)
        if (idx !== -1) { copy[dk] = [...rows]; copy[dk][idx] = updated; break }
      }
      return copy
    })
    toast.success("案件を更新しました")
  }, [])

  const key = dateKey(year, month, selectedDay)
  const currentData = dataStore[key] || []
  const supply = DAILY_SHIFT_SUPPLY[key] || null
  const m = computeMetrics(currentData, supply)

  // Sort by slot then time
  const sortedData = [...currentData].sort((a, b) => {
    const si = slotSortKey(a.slot) - slotSortKey(b.slot)
    if (si !== 0) return si
    return a.time.localeCompare(b.time)
  })

  const filteredData = search
    ? sortedData.filter((r) => {
        const q = search.toLowerCase()
        return r.clientName.toLowerCase().includes(q) || r.siteAddress.toLowerCase().includes(q) || r.contactPerson.toLowerCase().includes(q)
      })
    : sortedData

  const handleSync = useCallback(() => {
    setIsSyncing(true)
    const rowCount = (dataStore[dateKey(year, month, selectedDay)] || []).length
    setTimeout(() => {
      setIsSyncing(false)
      toast.success(`${month + 1}/${selectedDay}のデータをシートに書き込みました`, { description: `${rowCount}件の案件を同期しました` })
    }, 1200)
  }, [year, month, selectedDay, dataStore])

  return (
    <div className="space-y-0">
      <Toaster position="top-right" richColors />

      {/* Section 1: Title + Calendar */}
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{year}年 {month + 1}月</h1>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9"><CalendarIcon className="h-4 w-4" />日付を選択</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={new Date(year, month, selectedDay)} onSelect={handleCalendarSelect} defaultMonth={new Date(year, month)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Section 2: Date Strip */}
      <div className="mb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div ref={scrollRef} className="flex gap-1.5 pb-2 px-0.5">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dk = dateKey(year, month, day)
              return (
                <div key={day} ref={day === selectedDay ? selectedTabRef : undefined}>
                  <DateTab day={day} dayName={getDayName(year, month, day)} dayType={getDayType(year, month, day)} isSelected={day === selectedDay} hasData={!!dataStore[dk]} onSelect={handleSelectDay} />
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Section 3: Daily Metrics & Resource Balance Panel */}
      {currentData.length > 0 ? (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-900 text-white p-4">
          <div className="flex flex-wrap items-stretch gap-0">

            {/* Section A: Granular Time Breakdown */}
            <div className="flex items-center gap-3 px-4 py-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800 shrink-0">
                <Clock className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">時間帯別案件数</p>
                <div className="flex items-center gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot} className="text-center min-w-[36px]">
                      <p className="text-[9px] text-slate-500 leading-none">{SLOT_LABELS[slot]}</p>
                      <p className={`text-lg font-bold tabular-nums leading-none mt-0.5 ${m.slotCounts[slot] > 0 ? "text-slate-100" : "text-slate-600"}`}>
                        {m.slotCounts[slot]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-px bg-slate-700 self-stretch mx-2" />

            {/* Section B: Group Company (Outsourced) */}
            <div className="flex items-center gap-3 px-4 py-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800 shrink-0">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">協力会社</p>
                <div className="flex items-center gap-3">
                  {(["AG", "AF", "AA", "HM", "Omusubi"] as const).map((k) => {
                    const colors: Record<string, string> = {
                      AG: "text-amber-300", AF: "text-blue-300", AA: "text-purple-300", HM: "text-emerald-300", Omusubi: "text-orange-300",
                    }
                    const bgColors: Record<string, string> = {
                      AG: "bg-amber-500/20 border-amber-500/30", AF: "bg-blue-500/20 border-blue-500/30",
                      AA: "bg-purple-500/20 border-purple-500/30", HM: "bg-emerald-500/20 border-emerald-500/30",
                      Omusubi: "bg-orange-500/20 border-orange-500/30",
                    }
                    return (
                      <div key={k} className="text-center">
                        <Badge className={`${bgColors[k]} ${colors[k]} text-[10px] px-1.5 py-0 mb-0.5`}>
                          {k === "Omusubi" ? "\u{1F359}" : k}
                        </Badge>
                        <p className={`text-lg font-bold tabular-nums leading-none ${colors[k]}`}>{m.outsourced[k]}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="w-px bg-slate-700 self-stretch mx-2" />

            {/* Section C: Shift Availability & Balance */}
            <div className="flex items-center gap-4 px-4 py-1">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">自社作業員 需給バランス</p>
                <div className="flex items-start gap-6">
                  {/* AM */}
                  <div className="min-w-[140px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-slate-300">AM (午前)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-slate-500">出勤可能:</span>
                      <span className="font-bold text-slate-200 tabular-nums">{m.amAvailable}名</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-slate-500">稼働予定:</span>
                      <span className={`font-bold tabular-nums flex items-center gap-1 ${m.amShortage ? "text-red-400" : "text-emerald-400"}`}>
                        {m.amWorkers}名
                        {m.amShortage ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      </span>
                    </div>
                    <UtilBar assigned={m.amWorkers} available={m.amAvailable} isShortage={m.amShortage} />
                  </div>
                  {/* PM */}
                  <div className="min-w-[140px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Moon className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-xs font-medium text-slate-300">PM (午後)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-slate-500">出勤可能:</span>
                      <span className="font-bold text-slate-200 tabular-nums">{m.pmAvailable}名</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-slate-500">稼働予定:</span>
                      <span className={`font-bold tabular-nums flex items-center gap-1 ${m.pmShortage ? "text-red-400" : "text-emerald-400"}`}>
                        {m.pmWorkers}名
                        {m.pmShortage ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      </span>
                    </div>
                    <UtilBar assigned={m.pmWorkers} available={m.pmAvailable} isShortage={m.pmShortage} />
                  </div>
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

      {/* Section 4: Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-sm text-slate-600">
          <span className="font-medium">全 <span className="text-blue-600 font-bold">{m.totalOrders}</span> 件</span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="font-medium">自社 <span className="text-blue-600 font-bold">{m.activeInternal}</span></span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="font-medium">外注 <span className="text-orange-600 font-bold">{m.totalOutsourced}</span></span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="font-medium">人工 <span className="text-blue-600 font-bold">{m.amWorkers + m.pmWorkers}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-52 bg-white" />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
            スプシ同期
          </Button>
          <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4" />案件登録</Button>
        </div>
      </div>

      {/* Section 5: Data Grid */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="text-xs whitespace-nowrap w-16">時間</TableHead>
                <TableHead className="text-xs whitespace-nowrap w-24">発注先</TableHead>
                <TableHead className="text-xs min-w-[140px]">顧客・担当</TableHead>
                <TableHead className="text-xs min-w-[200px]">現場</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-14">人工</TableHead>
                <TableHead className="text-xs whitespace-nowrap w-16">区分</TableHead>
                <TableHead className="text-xs whitespace-nowrap w-16">依頼日</TableHead>
                <TableHead className="text-xs">備考</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-14">原本</TableHead>
                <TableHead className="text-xs text-center whitespace-nowrap w-12">編集</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => <DailyTableRow key={row.id} row={row} onEdit={handleEdit} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CalendarIcon className="h-8 w-8 text-slate-300" />
                      <p className="text-sm">{search ? "検索条件に一致する案件がありません" : `${month + 1}/${selectedDay} の案件データはありません`}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      {editRow && (
        <EditDialog row={editRow} open={!!editRow} onOpenChange={(v) => { if (!v) setEditRow(null) }} onSave={handleSave} />
      )}
    </div>
  )
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
