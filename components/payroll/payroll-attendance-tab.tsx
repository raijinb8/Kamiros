"use client"

import { useState, useMemo } from "react"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Eye, Search } from "lucide-react"
import type { AttendanceType } from "@/lib/payroll-data"
import { attendanceData } from "@/lib/payroll-data"

const cellStyles: Record<AttendanceType, string> = {
  "出": "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer",
  "休": "bg-slate-100 text-slate-500",
  "有": "bg-emerald-50 text-emerald-700",
  "欠": "bg-red-50 text-red-700",
  "—": "bg-white text-slate-300",
}

function getDayOfWeek(year: number, month: number, day: number): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"]
  return days[new Date(year, month - 1, day).getDay()]
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function AttendanceCell({ type, day, workerName }: { type: AttendanceType; day: number; workerName: string }) {
  if (type === "出") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`w-full h-full flex items-center justify-center text-xs font-medium ${cellStyles[type]} rounded transition-colors`}
          >
            {type}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" side="top">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              2/{ day} {workerName} の案件
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">ミロク東京 / 尾﨑 邸</span>
                <span className="font-mono tabular-nums text-slate-700">8.0h</span>
              </div>
              {day % 3 === 1 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">住友林業 / 渡辺 邸</span>
                  <span className="font-mono tabular-nums text-slate-700">3.0h</span>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className={`w-full h-full flex items-center justify-center text-xs font-medium ${cellStyles[type]} rounded`}>
      {type}
    </div>
  )
}

export function PayrollAttendanceTab() {
  const [attendanceMonth, setAttendanceMonth] = useState("2026-02")
  const [isDisplayed, setIsDisplayed] = useState(false)

  const { year, month, daysCount } = useMemo(() => {
    const [y, m] = attendanceMonth.split("-").map(Number)
    return { year: y, month: m, daysCount: getDaysInMonth(y, m) }
  }, [attendanceMonth])

  const dayHeaders = useMemo(() => {
    const headers = []
    for (let d = 1; d <= daysCount; d++) {
      const dow = getDayOfWeek(year, month, d)
      const isSunday = dow === "日"
      const isSaturday = dow === "土"
      headers.push({ day: d, dow, isSunday, isSaturday })
    }
    return headers
  }, [year, month, daysCount])

  const handleDisplay = () => {
    setIsDisplayed(true)
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Filter area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">作業年月</label>
              <Select value={attendanceMonth} onValueChange={setAttendanceMonth}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-12">2025年12月</SelectItem>
                  <SelectItem value="2026-01">2026年1月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleDisplay}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              表示
            </Button>
          </div>
        </CardContent>
      </Card>

      {isDisplayed && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: `${200 + daysCount * 36}px` }}>
              <thead>
                <tr className="bg-slate-50">
                  <th className="sticky left-0 z-20 bg-slate-50 text-left text-xs font-semibold text-slate-600 px-2 py-2 border-b border-r border-slate-200 w-12">
                    No
                  </th>
                  <th className="sticky left-12 z-20 bg-slate-50 text-left text-xs font-semibold text-slate-600 px-2 py-2 border-b border-r border-slate-200 w-24">
                    氏名
                  </th>
                  {dayHeaders.map(({ day, dow, isSunday, isSaturday }) => (
                    <th
                      key={day}
                      className={`text-center text-[10px] font-medium px-0 py-1.5 border-b border-slate-200 w-9 ${
                        isSunday
                          ? "text-red-500 bg-red-50/50"
                          : isSaturday
                            ? "text-blue-500 bg-blue-50/30"
                            : "text-slate-600"
                      }`}
                    >
                      <div>{day}</div>
                      <div className="text-[9px]">({dow})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row) => (
                  <tr key={row.workerNo} className="border-b border-slate-100 hover:bg-slate-50/40">
                    <td className="sticky left-0 z-10 bg-white text-xs text-slate-700 font-mono tabular-nums px-2 py-1.5 border-r border-slate-200">
                      {row.workerNo}
                    </td>
                    <td className="sticky left-12 z-10 bg-white text-xs text-slate-900 font-medium whitespace-nowrap px-2 py-1.5 border-r border-slate-200">
                      {row.name}
                    </td>
                    {row.days.slice(0, daysCount).map((type, i) => (
                      <td key={i} className="px-0.5 py-1 text-center">
                        <div className="w-8 h-7 mx-auto">
                          <AttendanceCell
                            type={type}
                            day={i + 1}
                            workerName={row.name}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* Summary rows */}
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-300">
                  <td className="sticky left-0 z-10 bg-slate-50 text-xs font-bold text-slate-900 px-2 py-2 border-r border-slate-200" colSpan={2}>
                    <div className="sticky left-0 flex items-center gap-4">
                      <span>集計</span>
                    </div>
                  </td>
                  {dayHeaders.map(({ day }) => {
                    const workCount = attendanceData.filter((r) => r.days[day - 1] === "出").length
                    return (
                      <td key={day} className="text-center text-[10px] font-medium text-slate-600 px-0 py-2">
                        {workCount > 0 ? workCount : ""}
                      </td>
                    )
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary grid below */}
          <div className="border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">作業員別集計</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left text-slate-600 font-semibold px-2 py-1.5">項目</th>
                    {attendanceData.map((r) => (
                      <th key={r.workerNo} className="text-center text-slate-600 font-medium px-2 py-1.5 whitespace-nowrap">
                        {r.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-2 py-1.5 text-slate-700 font-medium">出勤日数</td>
                    {attendanceData.map((r) => (
                      <td key={r.workerNo} className="text-center font-mono tabular-nums text-slate-900 px-2 py-1.5">
                        {r.workDays}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-2 py-1.5 text-slate-700 font-medium">有給日数</td>
                    {attendanceData.map((r) => (
                      <td key={r.workerNo} className="text-center font-mono tabular-nums text-slate-900 px-2 py-1.5">
                        {r.paidLeave}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5 text-slate-700 font-medium">欠勤日数</td>
                    {attendanceData.map((r) => (
                      <td key={r.workerNo} className={`text-center font-mono tabular-nums px-2 py-1.5 ${r.absences > 0 ? "text-red-600 font-medium" : "text-slate-900"}`}>
                        {r.absences}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!isDisplayed && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm">
              作業年月を選択し、「表示」ボタンを押してください。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
