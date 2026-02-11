"use client"

import { Suspense } from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Info, Send, Mail, CheckCircle2, FileText, AlertCircle, ChevronLeft, Users } from "lucide-react"
import { useShift } from "@/lib/shift-context"
import { BulkSendConfirmDialog, TemplateEditDialog } from "@/components/shift-send-dialogs"

function ShiftNotificationSendContent() {
  const router = useRouter()
  const {
    sites,
    workers,
    getWorkerAssignedSites,
    getAssignedWorkersForSite,
    sendLogs,
    addSendLog,
    markWorkerSent,
    markAllWorkersSent,
  } = useShift()

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [templateHeader, setTemplateHeader] = useState("")
  const [templateFooter, setTemplateFooter] = useState("")
  const [selectedWorkerPreview, setSelectedWorkerPreview] = useState<string | null>(null)

  const generateEmailContent = (workerName: string) => {
    const assignedSites = getWorkerAssignedSites(workerName)
    if (assignedSites.length === 0) return null

    const sections = assignedSites.map((site) => {
      const assignedWorkers = getAssignedWorkersForSite(site.id)
      return `${site.time}～
${site.tradingPartner}　${site.contactPerson}
${site.siteName}
${site.details}
班長：${assignedWorkers.join("、")}`
    })

    return sections.join("\n\n─────────────────────────────────\n\n")
  }

  const sendTargets = useMemo(() => {
    return workers.map((worker) => ({
      ...worker,
      assignedSiteCount: getWorkerAssignedSites(worker.name).length,
    }))
  }, [workers, getWorkerAssignedSites])

  const defaultPreviewWorker = useMemo(() => {
    return sendTargets.find((w) => w.assignedSiteCount > 0)
  }, [sendTargets])

  const previewWorkerName = selectedWorkerPreview || defaultPreviewWorker?.name || null
  const previewEmailContent = previewWorkerName ? generateEmailContent(previewWorkerName) : null

  const unsentCount = sendTargets.filter((t) => t.status === "unsent").length
  const sentCount = sendTargets.filter((t) => t.status === "sent").length

  const handleIndividualSend = (workerId: string) => {
    markWorkerSent(workerId, "sent")
    const newLog = {
      timestamp: new Date().toLocaleString("ja-JP"),
      totalRecipients: 1,
      successCount: 1,
      errorCount: 0,
    }
    addSendLog(newLog)
  }

  const handleBulkSend = () => {
    markAllWorkersSent()
    const newLog = {
      timestamp: new Date().toLocaleString("ja-JP"),
      totalRecipients: unsentCount,
      successCount: unsentCount,
      errorCount: 0,
    }
    addSendLog(newLog)
    setIsConfirmModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">シフト連絡一斉送信 - メール確認と送信</h1>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-blue-800">
          明日（1月15日）のシフト：対象 <span className="font-bold">45名</span> の作業員へメールを送信します。
        </p>
      </div>

      {/* Section 1: Email Preview */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                メール内容確認（リアルタイム更新）
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                実際に送信されるメール内容が、ページ1で選択した現場と作業員の紐付けに応じてリアルタイムで表示されます。
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              テンプレートを編集
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Worker selector for preview */}
          <div className="flex items-center gap-4 mb-4">
            <Label className="text-sm text-slate-600">プレビュー対象：</Label>
            <div className="flex flex-wrap gap-2">
              {sendTargets
                .filter((w) => w.assignedSiteCount > 0)
                .map((worker) => (
                  <Button
                    key={worker.id}
                    variant={previewWorkerName === worker.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWorkerPreview(worker.name)}
                    className={previewWorkerName === worker.name ? "bg-blue-600" : ""}
                  >
                    {worker.name}
                  </Button>
                ))}
            </div>
          </div>

          {previewWorkerName && previewEmailContent ? (
            <div className="border rounded-lg overflow-hidden bg-white">
              {/* Email Header */}
              <div className="bg-slate-50 border-b px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">宛先：</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {previewWorkerName}さん
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">件名：</span>
                    <span className="text-sm font-medium text-slate-900">明日の予定です</span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="max-h-[500px] overflow-y-auto p-6 bg-white">
                <pre
                  className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed"
                  style={{ fontFamily: "'Courier New', Courier, monospace" }}
                >
                  {previewEmailContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-12 bg-slate-50 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">現場に作業員を割り当てると、メール内容がここに表示されます。</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => router.push("/shift-notification")}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                現場と人の紐付けへ戻る
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Send Target Preview */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            送信対象者プレビュー
          </CardTitle>
          <p className="text-sm text-slate-500">メール送信対象の作業員一覧を確認してください。</p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">作業員名</TableHead>
                  <TableHead className="font-semibold text-slate-700">メールアドレス</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">割当現場数</TableHead>
                  <TableHead className="font-semibold text-slate-700">送信ステータス</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sendTargets.map((target) => (
                  <TableRow key={target.id} className={target.status === "sent" ? "bg-slate-50/50" : ""}>
                    <TableCell className="font-medium text-slate-900">{target.name}</TableCell>
                    <TableCell className="text-slate-600">{target.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          target.assignedSiteCount > 0
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }
                      >
                        {target.assignedSiteCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {target.status === "sent" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          送信済
                        </Badge>
                      ) : target.status === "error" ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          エラー
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
                          未送信
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIndividualSend(target.id)}
                        disabled={target.status === "sent" || target.assignedSiteCount === 0}
                      >
                        個別送信
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Send Execution */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5" />
            送信実行
          </CardTitle>
          <p className="text-sm text-slate-500">個別送信または一括送信を選択してください。</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Summary */}
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">未送信：</span>
              <Badge variant="outline" className="bg-slate-100 text-slate-700">
                {unsentCount}名
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">送信済：</span>
              <Badge className="bg-green-100 text-green-700">{sentCount}名</Badge>
            </div>
          </div>

          {/* Send Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={unsentCount === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              全員に一括送信
            </Button>
          </div>

          {/* Send Logs */}
          {sendLogs.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">送信ログ</h3>
              <div className="space-y-2">
                {sendLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg text-sm">
                    <span className="text-slate-600">{log.timestamp}</span>
                    <span className="text-slate-700">
                      対象者数：<span className="font-medium">{log.totalRecipients}</span>
                    </span>
                    <span className="text-green-600">
                      成功：<span className="font-medium">{log.successCount}</span>
                    </span>
                    <span className="text-red-600">
                      エラー：<span className="font-medium">{log.errorCount}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={() => router.push("/shift-notification")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
        {sentCount > 0 && sentCount === workers.length && (
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={() => router.push("/dashboard")}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            完了
          </Button>
        )}
      </div>

      {/* Lazy-loaded Dialogs */}
      {isConfirmModalOpen && (
        <BulkSendConfirmDialog
          open={isConfirmModalOpen}
          onOpenChange={setIsConfirmModalOpen}
          unsentCount={unsentCount}
          onConfirm={handleBulkSend}
        />
      )}
      {isTemplateModalOpen && (
        <TemplateEditDialog
          open={isTemplateModalOpen}
          onOpenChange={setIsTemplateModalOpen}
          templateHeader={templateHeader}
          onTemplateHeaderChange={setTemplateHeader}
          templateFooter={templateFooter}
          onTemplateFooterChange={setTemplateFooter}
        />
      )}

      {/* Template Edit Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
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
                onChange={(e) => setTemplateHeader(e.target.value)}
                placeholder="例：お疲れ様です。明日の予定をお知らせします。"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="template-footer">フッター（本文の後に追加）</Label>
              <Textarea
                id="template-footer"
                value={templateFooter}
                onChange={(e) => setTemplateFooter(e.target.value)}
                placeholder="例：よろしくお願いいたします。"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
              キャンセル
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsTemplateModalOpen(false)}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ShiftNotificationSendPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-8 w-96 bg-slate-200 rounded" /><div className="h-14 bg-blue-50 rounded-lg" /><div className="h-64 bg-slate-100 rounded-lg" /></div>}>
      <ShiftNotificationSendContent />
    </Suspense>
  )
}
