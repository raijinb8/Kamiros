"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Inbox, Send, TestTube, CheckCircle2, XCircle, Copy } from "lucide-react"
import { toast } from "sonner"

interface EmailSettings {
  senderEmail: string
  senderDisplayName: string
  ccEmail: string
}

const initialEmailSettings: EmailSettings = {
  senderEmail: "shift@kamiros-active.com",
  senderDisplayName: "株式会社アクティブ シフト連絡",
  ccEmail: "tanaka@active.co.jp",
}

export function EmailFaxTab() {
  const [settings, setSettings] = useState<EmailSettings>(initialEmailSettings)
  const [savedSettings, setSavedSettings] = useState<EmailSettings>(initialEmailSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isSendingFaxTest, setIsSendingFaxTest] = useState(false)

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  const updateSetting = useCallback((field: keyof EmailSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSavedSettings(settings)
    setIsSaving(false)
    toast.success("メール・FAX設定を保存しました")
  }

  const handleCancel = () => {
    setSettings(savedSettings)
  }

  const handleFaxTest = async () => {
    setIsSendingFaxTest(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSendingFaxTest(false)
    toast.success("テストメールを送信しました")
  }

  const handleEmailTest = async () => {
    if (!testEmail) {
      toast.error("送信先メールアドレスを入力してください")
      return
    }
    setIsSendingTest(true)
    setTestResult(null)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSendingTest(false)
    setTestResult("success")
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("fax-receive@kamiros-active.com")
    toast.success("メールアドレスをコピーしました")
  }

  return (
    <div className="space-y-6">
      {/* Section 1: FAX Reception Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Inbox className="h-5 w-5 text-slate-500" />
            FAX受信設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-600">Kamiros受信用メールアドレス</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 font-mono">
                fax-receive@kamiros-active.com
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              システムが自動割当。変更不可
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600">受信ステータス</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                正常稼働中
              </Badge>
              <span className="text-sm text-slate-500">
                最終受信: 2026/02/26 10:30
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              複合機のメール転送先に上記アドレスを設定してください。FAX番号・回線の変更は不要です。
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={handleFaxTest}
              disabled={isSendingFaxTest}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isSendingFaxTest ? "送信中..." : "テストメールを送信"}
            </Button>
            <p className="text-xs text-slate-500 mt-1">
              受信設定が正しいか確認するため、自分宛にテストPDFを送信します
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Shift Notification Email Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Send className="h-5 w-5 text-slate-500" />
            シフト連絡メール設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderEmail">送信元メールアドレス</Label>
              <Input
                id="senderEmail"
                type="email"
                value={settings.senderEmail}
                onChange={(e) => updateSetting("senderEmail", e.target.value)}
                placeholder="shift@example.com"
              />
              <p className="text-xs text-slate-500">作業員に届くメールのFrom</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderDisplayName">送信元表示名</Label>
              <Input
                id="senderDisplayName"
                value={settings.senderDisplayName}
                onChange={(e) => updateSetting("senderDisplayName", e.target.value)}
                placeholder="表示名を入力"
              />
              <p className="text-xs text-slate-500">作業員に届くメールの送信者名</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ccEmail">CC送信先</Label>
            <Input
              id="ccEmail"
              type="email"
              value={settings.ccEmail}
              onChange={(e) => updateSetting("ccEmail", e.target.value)}
              placeholder="cc@example.com"
              className="max-w-md"
            />
            <p className="text-xs text-slate-500">
              シフト連絡メールのCCに常に含めるアドレス（社長が控えを見たい場合など）
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Email Send Test */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <TestTube className="h-5 w-5 text-slate-500" />
            メール送信テスト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="space-y-2 flex-1 max-w-md">
              <Label htmlFor="testEmailAddress">テスト送信先メールアドレス</Label>
              <Input
                id="testEmailAddress"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleEmailTest}
              disabled={isSendingTest}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSendingTest ? "送信中..." : "テストメールを送信"}
            </Button>
          </div>
          {testResult === "success" && (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              送信成功
            </div>
          )}
          {testResult === "error" && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <XCircle className="h-4 w-4" />
              送信失敗: メールサーバーに接続できませんでした
            </div>
          )}
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
