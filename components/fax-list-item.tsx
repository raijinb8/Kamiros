"use client"

import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { FaxItem, FaxStatus } from "@/lib/fax-data"

function getStatusBadge(status: FaxStatus) {
  switch (status) {
    case "unconfirmed":
      return <Badge variant="secondary" className="bg-slate-100 text-slate-600">未確認</Badge>
    case "confirmed":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700">確認済</Badge>
    case "finalized":
      return <Badge variant="secondary" className="bg-green-100 text-green-700">確定済</Badge>
  }
}

function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

interface FaxListItemProps {
  fax: FaxItem
  isSelected: boolean
  onSelect: (fax: FaxItem) => void
  onClose: () => void
}

function FaxListItemInner({ fax, isSelected, onSelect, onClose }: FaxListItemProps) {
  return (
    <div
      className={`p-3 border-b border-slate-100 cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 border-l-4 border-l-blue-600"
          : "hover:bg-slate-50 border-l-4 border-l-transparent"
      }`}
      onClick={() => {
        onSelect(fax)
        onClose()
      }}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">
          {fax.status === "finalized" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <div
              className={`h-4 w-4 rounded border-2 ${
                fax.status === "confirmed" ? "border-amber-400 bg-amber-100" : "border-slate-300"
              }`}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs text-slate-500">{formatDateTime(fax.dateTime)}</span>
            {getStatusBadge(fax.status)}
          </div>
          <p className="text-sm font-medium text-slate-700 truncate">{fax.tradingPartner}</p>
          <p className="text-sm text-slate-600 truncate">{fax.siteName}</p>
        </div>
      </div>
    </div>
  )
}

export const FaxListItem = memo(FaxListItemInner, (prev, next) => {
  return (
    prev.fax === next.fax &&
    prev.isSelected === next.isSelected &&
    prev.onSelect === next.onSelect &&
    prev.onClose === next.onClose
  )
})
