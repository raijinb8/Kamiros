"use client"

import { useState } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

type PermissionLevel =
  | "—"
  | "閲覧"
  | "閲覧・編集"
  | "閲覧・承認"
  | "閲覧・確定"
  | "閲覧・送信"
  | "全権限"
  | "△ 一部閲覧"
  | "送信"

interface FeaturePermission {
  feature: string
  section: "admin" | "worker"
  president: PermissionLevel
  clerk: PermissionLevel
  worker: PermissionLevel
  presidentLocked: boolean
  workerLocked: boolean
}

const permissionOptions: PermissionLevel[] = [
  "—",
  "閲覧",
  "閲覧・編集",
  "閲覧・承認",
  "閲覧・確定",
  "閲覧・送信",
  "全権限",
  "△ 一部閲覧",
]

const initialPermissions: FeaturePermission[] = [
  { feature: "ダッシュボード", section: "admin", president: "閲覧", clerk: "閲覧", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "FAX受信・確認", section: "admin", president: "閲覧", clerk: "閲覧・編集", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "案件管理", section: "admin", president: "閲覧・編集", clerk: "閲覧・編集", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "シフト連絡", section: "admin", president: "閲覧・送信", clerk: "閲覧", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "現場終了報告", section: "admin", president: "閲覧・承認", clerk: "閲覧・承認", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "申請管理", section: "admin", president: "閲覧・承認", clerk: "閲覧・承認", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "請求管理", section: "admin", president: "閲覧・編集", clerk: "閲覧・編集", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "給与管理", section: "admin", president: "閲覧・確定", clerk: "閲覧", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "マスタ管理", section: "admin", president: "閲覧・編集", clerk: "閲覧・編集", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "設定", section: "admin", president: "全権限", clerk: "△ 一部閲覧", worker: "—", presidentLocked: true, workerLocked: true },
  { feature: "ホーム", section: "worker", president: "—", clerk: "—", worker: "閲覧", presidentLocked: true, workerLocked: true },
  { feature: "シフト確認", section: "worker", president: "—", clerk: "—", worker: "閲覧", presidentLocked: true, workerLocked: true },
  { feature: "現場報告", section: "worker", president: "—", clerk: "—", worker: "送信", presidentLocked: true, workerLocked: true },
  { feature: "各種申請", section: "worker", president: "—", clerk: "—", worker: "送信", presidentLocked: true, workerLocked: true },
  { feature: "給与明細", section: "worker", president: "—", clerk: "—", worker: "閲覧", presidentLocked: true, workerLocked: true },
]

export function PermissionsTab() {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(initialPermissions)
  const [savedPermissions, setSavedPermissions] = useState<FeaturePermission[]>(initialPermissions)
  const [isSaving, setIsSaving] = useState(false)

  const hasChanges = JSON.stringify(permissions) !== JSON.stringify(savedPermissions)

  const adminPermissions = permissions.filter((p) => p.section === "admin")
  const workerPermissions = permissions.filter((p) => p.section === "worker")

  const updateClerkPermission = (feature: string, value: PermissionLevel) => {
    setPermissions((prev) =>
      prev.map((p) => (p.feature === feature ? { ...p, clerk: value } : p))
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSavedPermissions(permissions)
    setIsSaving(false)
    toast.success("権限設定を保存しました")
  }

  const handleCancel = () => {
    setPermissions(savedPermissions)
  }

  const renderPermissionCell = (
    value: PermissionLevel,
    isLocked: boolean,
    onChange?: (value: PermissionLevel) => void
  ) => {
    if (isLocked) {
      return (
        <span
          className={`text-sm ${
            value === "—"
              ? "text-slate-300"
              : value === "全権限"
              ? "font-medium text-slate-700"
              : value === "△ 一部閲覧"
              ? "text-amber-600"
              : "text-slate-600"
          }`}
        >
          {value}
        </span>
      )
    }

    return (
      <Select value={value} onValueChange={(v) => onChange?.(v as PermissionLevel)}>
        <SelectTrigger className="h-8 text-sm min-w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {permissionOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-600 min-w-36">機能</TableHead>
                  <TableHead className="text-slate-600 text-center">
                    <div className="flex flex-col items-center">
                      <span>社長</span>
                      <span className="text-xs font-normal text-slate-400">変更不可</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 text-center">
                    <div className="flex flex-col items-center">
                      <span>事務員</span>
                      <span className="text-xs font-normal text-slate-400">編集可</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-600 text-center">
                    <div className="flex flex-col items-center">
                      <span>作業員</span>
                      <span className="text-xs font-normal text-slate-400">変更不可</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Admin section */}
                {adminPermissions.map((perm) => (
                  <TableRow key={perm.feature}>
                    <TableCell className="font-medium text-slate-900">{perm.feature}</TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.president, true)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.clerk, false, (value) =>
                        updateClerkPermission(perm.feature, value)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.worker, true)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Separator row */}
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="bg-slate-50 text-slate-500 text-xs font-medium py-2"
                  >
                    作業員UI
                  </TableCell>
                </TableRow>

                {/* Worker section */}
                {workerPermissions.map((perm) => (
                  <TableRow key={perm.feature}>
                    <TableCell className="font-medium text-slate-900">{perm.feature}</TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.president, true)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.clerk, false, (value) =>
                        updateClerkPermission(perm.feature, value)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderPermissionCell(perm.worker, true)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mt-4">
            <p className="text-sm text-slate-600">
              社長ロールは全機能にアクセスできます（変更不可）。事務員の権限を業務内容に応じて調整してください。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer buttons */}
      <div className="flex items-center gap-3 pb-6">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isSaving ? "保存中..." : "変更を保存"}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={!hasChanges}
        >
          変更を取り消す
        </Button>
      </div>
    </div>
  )
}
