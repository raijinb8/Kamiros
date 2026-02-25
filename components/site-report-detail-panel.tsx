"use client"

import { AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { SiteReport } from "@/lib/site-report-data"

function StatusBadge({ status }: { status: string }) {
  if (status === "未確認") {
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">
        {status}
      </Badge>
    )
  }
  if (status === "確認済み") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">
        {status}
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">
      {status}
    </Badge>
  )
}

function DiffCell({ planned, actual }: { planned: string; actual: string }) {
  const hasDiff = planned !== actual && planned !== "" && planned !== "—"
  return (
    <span className={hasDiff ? "text-red-600 font-semibold flex items-center gap-1" : "text-slate-700"}>
      {hasDiff && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
      {actual || "—"}
    </span>
  )
}

interface ReportDetailPanelProps {
  report: SiteReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
  onMarkDiff: (id: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function ReportDetailPanel({
  report,
  open,
  onOpenChange,
  onConfirm,
  onMarkDiff,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ReportDetailPanelProps) {
  if (!report) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0 gap-0"
      >
        {/* Panel Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="font-mono text-lg text-slate-900">
              {report.orderNumber}
            </SheetTitle>
            <StatusBadge status={report.status} />
          </div>
          <SheetDescription className="text-sm text-slate-500">
            {report.workerName} - {report.siteName}
          </SheetDescription>
          {/* Prev / Next navigation */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前の報告
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次の報告
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Section 1: 案件情報 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              案件情報
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">顧客名</span>
                <p className="font-medium text-slate-900">{report.clientFullName}</p>
              </div>
              <div>
                <span className="text-slate-500">現場名</span>
                <p className="font-medium text-slate-900">{report.siteName}</p>
              </div>
              <div>
                <span className="text-slate-500">現場住所</span>
                <p className="font-medium text-slate-900">{report.siteAddress}</p>
              </div>
              <div>
                <span className="text-slate-500">GC/HM</span>
                <p className="font-medium text-slate-900">{report.gcHm}</p>
              </div>
              <div>
                <span className="text-slate-500">作業区分</span>
                <p className="font-medium text-slate-900">{report.workCategory}</p>
              </div>
              <div>
                <span className="text-slate-500">予定人数</span>
                <p className="font-medium text-slate-900">{report.plannedWorkers}名</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 2: 予定 vs 実績 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              予定 vs 実績
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">項目</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">予定</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600 w-1/3">実績</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">作業日</td>
                    <td className="px-3 py-2 text-slate-700">{report.planned.workDate}</td>
                    <td className="px-3 py-2">
                      <DiffCell planned={report.planned.workDate} actual={report.actual.workDate} />
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">開始時刻</td>
                    <td className="px-3 py-2 text-slate-700">{report.planned.startTime}</td>
                    <td className="px-3 py-2">
                      <DiffCell planned={report.planned.startTime} actual={report.actual.startTime} />
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">終了時刻</td>
                    <td className="px-3 py-2 text-slate-700">{report.planned.endTime}</td>
                    <td className="px-3 py-2">
                      <DiffCell planned={report.planned.endTime} actual={report.actual.endTime} />
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">作業時間</td>
                    <td className="px-3 py-2 text-slate-700">{report.planned.duration}</td>
                    <td className="px-3 py-2">
                      <DiffCell planned={report.planned.duration} actual={report.actual.duration} />
                    </td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">立会者区分</td>
                    <td className="px-3 py-2 text-slate-700">{"—"}</td>
                    <td className="px-3 py-2 text-slate-700">{report.actual.witnessCategory}</td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-500">立会者名</td>
                    <td className="px-3 py-2 text-slate-700">{"—"}</td>
                    <td className="px-3 py-2 text-slate-700">{report.actual.witnessName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Section 3: 報告詳細 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              報告詳細
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">備考</span>
                <p className="text-sm text-slate-900 mt-0.5">
                  {report.fullNotes || "（なし）"}
                </p>
              </div>
              {report.hasPhotos && (
                <div>
                  <span className="text-sm text-slate-500">添付写真</span>
                  <div className="mt-1 flex gap-2">
                    <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm text-slate-500">報告日時</span>
                <p className="text-sm text-slate-900 mt-0.5">{report.reportedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
          {report.status !== "確認済み" && (
            <Button
              onClick={() => onConfirm(report.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              確認済みにする
            </Button>
          )}
          {report.status !== "差異あり" && (
            <Button
              variant="outline"
              onClick={() => onMarkDiff(report.id)}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              差異ありに変更
            </Button>
          )}
          <Button variant="link" className="text-slate-500 hover:text-slate-700 ml-auto h-auto p-0">
            案件データを開く
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
