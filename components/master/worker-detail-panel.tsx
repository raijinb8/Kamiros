"use client"

import { ChevronLeft, ChevronRight, Pencil } from "lucide-react"
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
import type { Worker } from "@/lib/master-data"
import { formatJPY } from "@/lib/master-data"

interface WorkerDetailPanelProps {
  worker: Worker | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (worker: Worker) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-slate-500 text-xs">{label}</span>
      <p className={`font-medium text-slate-900 text-sm ${mono ? "font-mono tabular-nums" : ""}`}>{value || "-"}</p>
    </div>
  )
}

// Check if a price is custom (different from defaults)
function isCustomPrice(worker: Worker): boolean {
  if (worker.employmentType === "アルバイト") {
    return worker.fullPrice !== 9000 || worker.halfPrice !== 6000
  }
  return worker.fullPrice !== 11200 || worker.halfPrice !== 8200
}

export function WorkerDetailPanel({
  worker,
  open,
  onOpenChange,
  onEdit,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: WorkerDetailPanelProps) {
  if (!worker) return null

  const defaultLabel = worker.employmentType === "アルバイト"
    ? "デフォルト（アルバイト: フル¥9,000 / ハーフ¥6,000）"
    : "デフォルト（個人事業主: フル¥11,200 / ハーフ¥8,200）"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
        {/* Panel Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 pr-8 flex-wrap">
            <SheetTitle className="text-lg text-slate-900">{worker.name}</SheetTitle>
            {worker.employmentType === "アルバイト" ? (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">アルバイト</Badge>
            ) : (
              <Badge className="bg-violet-100 text-violet-700 border-violet-200" variant="outline">個人事業主</Badge>
            )}
            {worker.status === "在籍" ? (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">在籍</Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-500 border-slate-300" variant="outline">退職</Badge>
            )}
          </div>
          <SheetDescription className="text-sm text-slate-500">
            作業員No. {worker.no}
          </SheetDescription>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-500 hover:text-slate-900 h-7 px-2"
            >
              次へ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-slate-300"
                onClick={() => onEdit(worker)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                編集
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">基本情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="作業員No." value={worker.no.toString()} mono />
              <InfoRow label="氏名" value={worker.name} />
              <InfoRow label="フリガナ" value={worker.furigana} />
              <InfoRow label="生年月日" value={worker.birthDate} mono />
              <InfoRow label="電話番号" value={worker.phone} mono />
              <InfoRow label="メールアドレス" value={worker.email} />
              <InfoRow label="郵便番号" value={worker.postalCode} mono />
              <InfoRow label="最寄り駅" value={worker.nearestStation} />
              <div className="col-span-2">
                <InfoRow label="住所" value={worker.address} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Employment Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">雇用情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="雇用形態" value={worker.employmentType} />
              <InfoRow label="入社日" value={worker.startDate} mono />
              <div>
                <span className="text-slate-500 text-xs">資格</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {worker.qualifications.length > 0 ? (
                    worker.qualifications.map((q, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                        {q}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>
              </div>
              <InfoRow label="緊急連絡先" value={worker.emergencyContact} />
            </div>
          </div>

          <Separator />

          {/* Section 3: Pay Rates & Allowances */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              支払単価・手当
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-xs text-amber-700 font-medium">フル単価</span>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-amber-900 font-mono tabular-nums">{formatJPY(worker.fullPrice)}</p>
                    {isCustomPrice(worker) && (
                      <Badge className="bg-amber-200 text-amber-800 border-amber-300 text-[10px]" variant="outline">カスタム</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-amber-700 font-medium">ハーフ単価</span>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-amber-900 font-mono tabular-nums">{formatJPY(worker.halfPrice)}</p>
                    {isCustomPrice(worker) && (
                      <Badge className="bg-amber-200 text-amber-800 border-amber-300 text-[10px]" variant="outline">カスタム</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator className="my-3 bg-amber-200" />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-amber-600">遠方手当</span>
                  <p className="font-medium text-amber-900 font-mono tabular-nums">{formatJPY(worker.distanceAllowance)} / 現場</p>
                </div>
                <div>
                  <span className="text-xs text-amber-600">早出手当</span>
                  <p className="font-medium text-amber-900 font-mono tabular-nums">{formatJPY(worker.earlyAllowance)} / 回</p>
                </div>
                <div>
                  <span className="text-xs text-amber-600">祝日手当</span>
                  <p className="font-medium text-amber-900 font-mono tabular-nums">{worker.holidayAllowanceRate}%アップ</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-3">
                この単価で作業員への給与が計算されます。{defaultLabel}
              </p>
            </div>
          </div>

          <Separator />

          {/* Section 4: Bank Account Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">給与・口座情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="銀行名" value={worker.bankName} />
              <InfoRow label="支店名" value={worker.branchName} />
              <InfoRow label="口座種別" value={worker.accountType} />
              <InfoRow label="口座番号" value={worker.accountNumber} mono />
              <InfoRow label="口座名義" value={worker.accountHolder} />
            </div>
          </div>

          <Separator />

          {/* Section 5: Paid Leave Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">有給休暇情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoRow label="年間付与日数" value={`${worker.annualLeave}日`} />
              <InfoRow label="使用済み" value={`${worker.usedLeave}日`} />
              <InfoRow label="残日数" value={`${worker.remainingLeave}日`} />
              <InfoRow label="次回付与日" value={worker.nextLeaveDate} mono />
            </div>
          </div>

          <Separator />

          {/* Section 6: Monthly Performance Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">稼働実績サマリー（当月）</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-xs text-slate-500">稼働数（ハーフ換算）</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">{worker.monthlyWork}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">内金累計</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">
                  <span className="text-blue-600 hover:underline cursor-pointer">{formatJPY(worker.monthlyAdvance)}</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500">給与見込み（暫定）</span>
                <p className="font-medium text-slate-900 text-sm font-mono tabular-nums">
                  <span className="text-blue-600 hover:underline cursor-pointer">{formatJPY(worker.monthlyPayEstimate)}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 7: Notes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">備考</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{worker.notes || "なし"}</p>
          </div>

          <Separator />

          {/* Section 8: Audit History */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">更新履歴</h3>
            <div className="space-y-3">
              {worker.history.map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-slate-400 font-mono tabular-nums whitespace-nowrap text-xs shrink-0 pt-0.5">
                    {entry.datetime}
                  </span>
                  <div>
                    <span className="text-slate-600 text-xs">{entry.operator}</span>
                    <p className="text-slate-900 text-sm">{entry.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
