"use client"

import { memo, useCallback } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SiteData, WorkerData } from "@/lib/shift-context"

interface SiteAssignmentRowProps {
  site: SiteData
  allWorkers: WorkerData[]
  onWorkerChange: (siteId: string, slotIndex: number, value: string) => void
}

function getAssignmentStatus(assignedWorkers: (string | null)[]): "unassigned" | "assigned" | "partial" {
  const assigned = assignedWorkers.filter((w) => w !== null).length
  if (assigned === 0) return "unassigned"
  if (assigned === assignedWorkers.length) return "assigned"
  return "partial"
}

function SiteAssignmentRowInner({ site, allWorkers, onWorkerChange }: SiteAssignmentRowProps) {
  const status = getAssignmentStatus(site.assignedWorkers)

  const handleChange = useCallback(
    (slotIndex: number, value: string) => {
      onWorkerChange(site.id, slotIndex, value)
    },
    [site.id, onWorkerChange],
  )

  return (
    <TableRow
      className={
        status === "assigned" ? "bg-green-50/50" : status === "partial" ? "bg-yellow-50/50" : "bg-white"
      }
    >
      <TableCell className="font-medium text-slate-900">{site.time}</TableCell>
      <TableCell className="text-slate-700 font-medium">{site.siteName}</TableCell>
      <TableCell className="text-slate-600">{site.tradingPartner}</TableCell>
      <TableCell className="text-slate-600 text-sm">{site.address}</TableCell>
      {Array.from({ length: 4 }).map((_, slotIndex) => {
        if (slotIndex >= site.requiredWorkers) {
          return (
            <TableCell key={slotIndex}>
              <div className="h-9 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-sm">
                {"—"}
              </div>
            </TableCell>
          )
        }

        // Compute available workers for this specific slot
        const assignedInOtherSlots = site.assignedWorkers.filter(
          (w, idx) => w !== null && idx !== slotIndex,
        )
        const availableWorkers = allWorkers.filter(
          (worker) => !assignedInOtherSlots.includes(worker.name),
        )
        const currentValue = site.assignedWorkers[slotIndex]

        return (
          <TableCell key={slotIndex}>
            <Select
              value={currentValue || "none"}
              onValueChange={(value) => handleChange(slotIndex, value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-slate-400">
                  選択してください
                </SelectItem>
                {availableWorkers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.name}>
                    {worker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export const SiteAssignmentRow = memo(SiteAssignmentRowInner, (prev, next) => {
  // Only re-render if the specific site's data changed or allWorkers changed
  return (
    prev.site === next.site &&
    prev.allWorkers === next.allWorkers &&
    prev.onWorkerChange === next.onWorkerChange
  )
})
