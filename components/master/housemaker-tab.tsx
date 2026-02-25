"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { HouseMaker } from "@/lib/master-data"
import { houseMakers as initialHouseMakers } from "@/lib/master-data"

export function HousemakerTab() {
  const [houseMakers, setHouseMakers] = useState<HouseMaker[]>(initialHouseMakers)
  const [searchText, setSearchText] = useState("")

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHM, setEditingHM] = useState<HouseMaker | null>(null)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingHM, setDeletingHM] = useState<HouseMaker | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formNotes, setFormNotes] = useState("")

  // Filtering
  const filteredHouseMakers = useMemo(() => {
    if (!searchText.trim()) return houseMakers
    const q = searchText.trim().toLowerCase()
    return houseMakers.filter(
      (hm) => hm.name.toLowerCase().includes(q) || hm.code.toLowerCase().includes(q)
    )
  }, [houseMakers, searchText])

  const openNewModal = useCallback(() => {
    setEditingHM(null)
    setFormName("")
    setFormNotes("")
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((hm: HouseMaker) => {
    setEditingHM(hm)
    setFormName(hm.name)
    setFormNotes(hm.notes)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    if (!formName.trim()) {
      toast.error("ハウスメーカー名は必須です")
      return
    }

    if (editingHM) {
      setHouseMakers((prev) =>
        prev.map((hm) =>
          hm.id === editingHM.id
            ? { ...hm, name: formName.trim(), notes: formNotes.trim() }
            : hm
        )
      )
      toast.success("ハウスメーカーを更新しました")
    } else {
      const newCode = `HM-${String(houseMakers.length + 1).padStart(3, "0")}`
      const newHM: HouseMaker = {
        id: `hm-${Date.now()}`,
        code: newCode,
        name: formName.trim(),
        customerCount: 0,
        notes: formNotes.trim(),
      }
      setHouseMakers((prev) => [...prev, newHM])
      toast.success("ハウスメーカーを登録しました")
    }
    setModalOpen(false)
  }, [editingHM, formName, formNotes, houseMakers.length])

  const handleDeleteConfirm = useCallback((hm: HouseMaker) => {
    if (hm.customerCount > 0) {
      toast.error(`${hm.name}には${hm.customerCount}社の得意先が紐づいているため削除できません`)
      return
    }
    setDeletingHM(hm)
    setDeleteDialogOpen(true)
  }, [])

  const handleDelete = useCallback(() => {
    if (!deletingHM) return
    setHouseMakers((prev) => prev.filter((hm) => hm.id !== deletingHM.id))
    setDeleteDialogOpen(false)
    setDeletingHM(null)
    toast.success("ハウスメーカーを削除しました")
  }, [deletingHM])

  return (
    <div className="space-y-4 min-w-0">
      {/* Filter + Action area */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5 flex-1 min-w-[200px] max-w-sm">
              <label className="text-xs font-medium text-slate-600">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ハウスメーカー名・コードで検索"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div className="ml-auto">
              <Button
                onClick={openNewModal}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                新規登録
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HM table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-28">HMコード</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">ハウスメーカー名</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold text-right whitespace-nowrap w-28">得意先数</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap">備考</TableHead>
                <TableHead className="text-slate-600 text-xs font-semibold whitespace-nowrap w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHouseMakers.map((hm) => (
                <TableRow key={hm.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-mono text-sm text-slate-700 tabular-nums">{hm.code}</TableCell>
                  <TableCell className="text-sm text-slate-900 font-medium">{hm.name}</TableCell>
                  <TableCell className="text-sm text-slate-700 text-right font-mono tabular-nums">{hm.customerCount}</TableCell>
                  <TableCell className="text-sm text-slate-500">{hm.notes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                        onClick={() => openEditModal(hm)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">編集</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-red-600"
                        onClick={() => handleDeleteConfirm(hm)}
                        disabled={hm.customerCount > 0}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            {filteredHouseMakers.length}件 表示中
          </span>
        </div>
      </div>

      {/* Edit/New Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-slate-900">
              {editingHM ? "ハウスメーカーを編集" : "ハウスメーカーを新規登録"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {editingHM ? `${editingHM.code} - ${editingHM.name}` : "新しいハウスメーカーの情報を入力してください。"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editingHM && (
              <div>
                <label className="text-xs font-medium text-slate-600">HMコード</label>
                <Input value={editingHM.code} readOnly className="h-9 text-sm bg-slate-50 mt-1" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-600">
                ハウスメーカー名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-9 text-sm mt-1"
                placeholder="例: ミサワホーム"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">備考</label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="min-h-[60px] text-sm mt-1"
                placeholder="備考を入力..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ハウスメーカーの削除</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingHM?.name} を削除してもよろしいですか？この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
