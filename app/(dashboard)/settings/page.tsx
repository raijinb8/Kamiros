"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Mail, Lock, Server, Cpu, Clock, LogOut, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [username, setUsername] = useState("山田 太郎")
  const [email, setEmail] = useState("yamada@kamiros.co.jp")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // System status (mock data)
  const systemStatus = {
    atvServer: "connected" as "connected" | "disconnected",
    geminiApi: "connected" as "connected" | "connected" | "disconnected",
    lastSync: "2026-01-14 18:45:32",
  }

  const handleSaveAccount = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("新しいパスワードが一致しません")
      return
    }
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowPasswordModal(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    alert("パスワードが変更されました")
  }

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = "/"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">設定</h1>
        <p className="text-slate-500 mt-1">アカウントとシステムの設定を管理します</p>
      </div>

      {/* Section 1: Account Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            アカウント設定
          </CardTitle>
          <CardDescription>ユーザー情報とパスワードを管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                ユーザー名
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              パスワードを変更
            </Button>
            <Button
              onClick={handleSaveAccount}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  保存しました
                </>
              ) : (
                "変更を保存"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: System Integration Status */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Server className="h-5 w-5" />
            システム連携状態
          </CardTitle>
          <CardDescription>外部システムとの接続状態を確認します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Server className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">atvサーバー</p>
                  <p className="text-sm text-slate-500">基幹システムとの連携</p>
                </div>
              </div>
              {systemStatus.atvServer === "connected" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  接続中
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  切断
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Cpu className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Gemini API</p>
                  <p className="text-sm text-slate-500">AI文字認識エンジン</p>
                </div>
              </div>
              {systemStatus.geminiApi === "connected" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  接続中
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  切断
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
              <Clock className="h-4 w-4" />
              最後の同期: {systemStatus.lastSync}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Other Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            その他の設定
          </CardTitle>
          <CardDescription>セッション管理とアプリケーション設定</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            ログアウト
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>パスワードを変更</DialogTitle>
            <DialogDescription>
              セキュリティのため、現在のパスワードを入力してから新しいパスワードを設定してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">現在のパスワード</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="現在のパスワード"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="新しいパスワード"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="新しいパスワードを再入力"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              キャンセル
            </Button>
            <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700 text-white">
              変更を保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ログアウトの確認</DialogTitle>
            <DialogDescription>
              本当にログアウトしますか？再度ログインするまでシステムにアクセスできなくなります。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              ログアウト
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
