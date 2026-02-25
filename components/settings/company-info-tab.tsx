"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, FileText, ImageIcon, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface CompanyInfo {
  companyName: string
  representative: string
  postalCode: string
  address: string
  phone: string
  fax: string
  invoiceNumber: string
  bankName: string
  branchName: string
  accountType: string
  accountNumber: string
  accountHolder: string
}

const initialData: CompanyInfo = {
  companyName: "株式会社アクティブ",
  representative: "田中 篤史",
  postalCode: "184-0005",
  address: "東京都小金井市桜町3-4-2",
  phone: "042-380-7817",
  fax: "042-381-1326",
  invoiceNumber: "T1234567890123",
  bankName: "三井住友銀行",
  branchName: "川口支店",
  accountType: "普通",
  accountNumber: "1234567",
  accountHolder: "カ）アクティブ",
}

export function CompanyInfoTab() {
  const [formData, setFormData] = useState<CompanyInfo>(initialData)
  const [savedData, setSavedData] = useState<CompanyInfo>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<string | null>(null)

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(savedData)

  const updateField = useCallback((field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSavedData(formData)
    setIsSaving(false)
    toast.success("会社情報を保存しました")
  }

  const handleCancel = () => {
    setFormData(savedData)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setLogoFile(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoDelete = () => {
    setLogoFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Info */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-slate-500" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                会社名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="会社名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="representative">代表者名</Label>
              <Input
                id="representative"
                value={formData.representative}
                onChange={(e) => updateField("representative", e.target.value)}
                placeholder="代表者名を入力"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                placeholder="000-0000"
                className="max-w-48"
              />
              <p className="text-xs text-slate-500">入力で住所を自動補完します</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                住所 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="住所を入力"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="000-000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax">FAX番号</Label>
              <Input
                id="fax"
                value={formData.fax}
                onChange={(e) => updateField("fax", e.target.value)}
                placeholder="000-000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Invoice & Billing Info */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-slate-500" />
            インボイス・請求書情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">インボイス登録番号</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
              placeholder="T0000000000000"
              className="max-w-72"
            />
            <p className="text-xs text-slate-500">請求書PDFに自動反映されます</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankName">振込先銀行名</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => updateField("bankName", e.target.value)}
                placeholder="銀行名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">振込先支店名</Label>
              <Input
                id="branchName"
                value={formData.branchName}
                onChange={(e) => updateField("branchName", e.target.value)}
                placeholder="支店名を入力"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accountType">振込先口座種別</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => updateField("accountType", value)}
              >
                <SelectTrigger id="accountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="普通">普通</SelectItem>
                  <SelectItem value="当座">当座</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">振込先口座番号</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => updateField("accountNumber", e.target.value)}
                placeholder="0000000"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolder">振込先口座名義</Label>
              <Input
                id="accountHolder"
                value={formData.accountHolder}
                onChange={(e) => updateField("accountHolder", e.target.value)}
                placeholder="口座名義を入力"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Logo */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <ImageIcon className="h-5 w-5 text-slate-500" />
            ロゴ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            請求書PDF・シフト連絡メールのヘッダーに使用されます
          </p>
          <div className="flex items-start gap-6">
            <div className="w-40 h-24 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
              {logoFile ? (
                <img
                  src={logoFile}
                  alt="会社ロゴ"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-xs text-slate-400">ロゴ未設定</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="logo-upload"
                className="cursor-pointer"
              >
                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Upload className="h-4 w-4" />
                  ロゴを変更
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </Label>
              {logoFile && (
                <button
                  type="button"
                  onClick={handleLogoDelete}
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  ロゴを削除
                </button>
              )}
            </div>
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
