"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FaxConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function FaxConfirmDialog({ open, onOpenChange, onConfirm }: FaxConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>FAXを確定しますか？</DialogTitle>
          <DialogDescription>このFAXを確定して、基幹システムへ送信しますか？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onConfirm}>
            送信を実行する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
