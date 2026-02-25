"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Image as ImageIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import type { SiteConditionReport, ConfirmStatus } from "@/lib/request-data"

function StatusBadge({ status }: { status: ConfirmStatus }) {
  if (status === "未確認") {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200" variant="outline">未確認</Badge>
  }
  return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">確認済み</Badge>
}

interface SiteConditionDetailPanelProps {
  report: SiteConditionReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
  onUpdateMemo: (id: string, memo: string) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function SiteConditionDetailPanel({
  report,
  open,
  onOpenChange,
  onConfirm,
  onUpdateMemo,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: SiteConditionDetailPanelProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!report) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
          {/* Header */}
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3 pr-8">
              <SheetTitle className="text-lg text-slate-900 truncate">
                {report.siteName}
              </SheetTitle>
              <StatusBadge status={report.status} />
            </div>
            <SheetDescription className="text-sm text-slate-500">
              {report.workerName} - {report.reportedAt}
            </SheetDescription>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={onPrev} disabled={!hasPrev} className="text-slate-500 hover:text-slate-900 h-7 px-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                前の報告
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="ghost" size="sm" onClick={onNext} disabled={!hasNext} className="text-slate-500 hover:text-slate-900 h-7 px-2">
                次の報告
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Section 1: 報告情報 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                報告情報
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-slate-500">報告者</span>
                  <p className="font-medium text-slate-900">{report.workerName}（No.{report.workerNo}）</p>
                </div>
                <div>
                  <span className="text-slate-500">報告日時</span>
                  <p className="font-medium text-slate-900">{report.reportedAt}</p>
                </div>
                <div>
                  <span className="text-slate-500">現場名</span>
                  <p className="font-medium text-slate-900">{report.siteName}</p>
                </div>
                {report.clientHm && (
                  <div>
                    <span className="text-slate-500">顧客/HM</span>
                    <p className="font-medium text-slate-900">{report.clientHm}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Section 2: 写真ギャラリー */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                写真（{report.photoCount}枚）
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {report.photos.map((photo, index) => (
                  <button
                    key={photo}
                    onClick={() => {
                      setLightboxIndex(index)
                      setLightboxOpen(true)
                    }}
                    className="aspect-square rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs text-slate-500">{photo}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Section 3: 備考 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                備考
              </h3>
              <p className="text-sm text-slate-700">
                {report.notes || "備考なし"}
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Section 4: 対応メモ */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                対応メモ（事務員記入）
              </h3>
              <Textarea
                value={report.adminMemo}
                onChange={(e) => onUpdateMemo(report.id, e.target.value)}
                placeholder="対応内容や社内共有メモを記入..."
                className="min-h-[80px] border-slate-300 text-sm"
              />
            </div>

            {/* Data integration note */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
              情報共有のみ（データ連動なし）
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center gap-3">
            {report.status === "未確認" && (
              <Button
                onClick={() => {
                  onConfirm(report.id)
                  onOpenChange(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                確認済みにする
              </Button>
            )}
            <Button variant="outline" disabled className="border-slate-300 text-slate-400">
              <Send className="h-4 w-4 mr-1.5" />
              取引先に転送
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-2xl p-0 bg-slate-900 border-slate-700">
          <div className="relative flex items-center justify-center min-h-[400px] p-8">
            <div className="w-full aspect-[4/3] rounded-lg bg-slate-800 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="h-16 w-16 mb-2" />
              <span className="text-sm text-slate-300">{report.photos[lightboxIndex]}</span>
            </div>
            {report.photos.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => Math.max(0, prev - 1))}
                  disabled={lightboxIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700 disabled:opacity-30"
                  aria-label="前の写真"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => Math.min(report.photos.length - 1, prev + 1))}
                  disabled={lightboxIndex === report.photos.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700 disabled:opacity-30"
                  aria-label="次の写真"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="px-4 pb-3 text-center text-xs text-slate-400">
            {lightboxIndex + 1} / {report.photos.length}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
