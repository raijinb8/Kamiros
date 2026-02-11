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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface BulkSendConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unsentCount: number
  onConfirm: () => void
}

export function BulkSendConfirmDialog({ open, onOpenChange, unsentCount, onConfirm }: BulkSendConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>一括送信の確認</DialogTitle>
          <DialogDescription>
            本当に{unsentCount}名の作業員に連絡メールを一斉送信しますか？この操作は取り消せません。
          </DialogDescription>
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

interface TemplateEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateHeader: string
  onTemplateHeaderChange: (value: string) => void
  templateFooter: string
  onTemplateFooterChange: (value: string) => void
}

export function TemplateEditDialog({
  open,
  onOpenChange,
  templateHeader,
  onTemplateHeaderChange,
  templateFooter,
  onTemplateFooterChange,
}: TemplateEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>メールテンプレートを編集</DialogTitle>
          <DialogDescription>メールのヘッダーとフッターをカスタマイズできます。</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="template-header">ヘッダー（本文の前に追加）</Label>
            <Textarea
              id="template-header"
              value={templateHeader}
              onChange={(e) => onTemplateHeaderChange(e.target.value)}
              placeholder="例：お疲れ様です。明日の予定をお知らせします。"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="template-footer">フッター（本文の後に追加）</Label>
            <Textarea
              id="template-footer"
              value={templateFooter}
              onChange={(e) => onTemplateFooterChange(e.target.value)}
              placeholder="例：よろしくお願いいたします。"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onOpenChange(false)}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
