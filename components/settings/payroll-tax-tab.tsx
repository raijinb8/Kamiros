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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calculator, Shield, Users, Gift, CalendarDays, Plus, Pencil } from "lucide-react"
import { toast } from "sonner"

interface TaxSettings {
  standardTaxRate: string
  reducedTaxRate: string
  healthInsurance: string
  pensionInsurance: string
  employmentInsuranceEmployer: string
  employmentInsuranceWorker: string
  payrollCutoffDay: string
  payrollPaymentDay: string
}

interface UnitPrice {
  id: string
  employmentType: string
  fullRate: number
  halfRate: number
}

interface Allowance {
  id: string
  name: string
  amount: string
  type: string
  description: string
}

const initialTaxSettings: TaxSettings = {
  standardTaxRate: "10",
  reducedTaxRate: "8",
  healthInsurance: "4.91",
  pensionInsurance: "9.15",
  employmentInsuranceEmployer: "0.95",
  employmentInsuranceWorker: "0.60",
  payrollCutoffDay: "月末",
  payrollPaymentDay: "翌月10日",
}

const initialUnitPrices: UnitPrice[] = [
  { id: "1", employmentType: "アルバイト", fullRate: 9000, halfRate: 6000 },
  { id: "2", employmentType: "個人事業主", fullRate: 11200, halfRate: 8200 },
]

const initialAllowances: Allowance[] = [
  { id: "1", name: "遠方手当", amount: "¥2,000", type: "固定額 / 現場", description: "" },
  { id: "2", name: "早出手当", amount: "¥1,500", type: "固定額 / 回", description: "" },
  { id: "3", name: "祝日手当", amount: "25%", type: "料率", description: "基本単価に対するアップ率" },
]

export function PayrollTaxTab() {
  const [settings, setSettings] = useState<TaxSettings>(initialTaxSettings)
  const [savedSettings, setSavedSettings] = useState<TaxSettings>(initialTaxSettings)
  const [unitPrices, setUnitPrices] = useState<UnitPrice[]>(initialUnitPrices)
  const [savedUnitPrices, setSavedUnitPrices] = useState<UnitPrice[]>(initialUnitPrices)
  const [allowances, setAllowances] = useState<Allowance[]>(initialAllowances)
  const [savedAllowances, setSavedAllowances] = useState<Allowance[]>(initialAllowances)
  const [isSaving, setIsSaving] = useState(false)

  // Allowance edit modal
  const [editingAllowance, setEditingAllowance] = useState<Allowance | null>(null)
  const [showAllowanceModal, setShowAllowanceModal] = useState(false)

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings) ||
    JSON.stringify(unitPrices) !== JSON.stringify(savedUnitPrices) ||
    JSON.stringify(allowances) !== JSON.stringify(savedAllowances)

  const updateSetting = useCallback((field: keyof TaxSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSavedSettings(settings)
    setSavedUnitPrices(unitPrices)
    setSavedAllowances(allowances)
    setIsSaving(false)
    toast.success("給与・税設定を保存しました")
  }

  const handleCancel = () => {
    setSettings(savedSettings)
    setUnitPrices(savedUnitPrices)
    setAllowances(savedAllowances)
  }

  const updateUnitPrice = (id: string, field: "fullRate" | "halfRate", value: string) => {
    setUnitPrices((prev) =>
      prev.map((up) =>
        up.id === id ? { ...up, [field]: Number(value) || 0 } : up
      )
    )
  }

  const addUnitPrice = () => {
    setUnitPrices((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        employmentType: "",
        fullRate: 0,
        halfRate: 0,
      },
    ])
  }

  const openAllowanceModal = (allowance?: Allowance) => {
    if (allowance) {
      setEditingAllowance({ ...allowance })
    } else {
      setEditingAllowance({
        id: String(Date.now()),
        name: "",
        amount: "",
        type: "固定額 / 回",
        description: "",
      })
    }
    setShowAllowanceModal(true)
  }

  const saveAllowance = () => {
    if (!editingAllowance) return
    setAllowances((prev) => {
      const exists = prev.find((a) => a.id === editingAllowance.id)
      if (exists) {
        return prev.map((a) => (a.id === editingAllowance.id ? editingAllowance : a))
      }
      return [...prev, editingAllowance]
    })
    setShowAllowanceModal(false)
    setEditingAllowance(null)
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Consumption Tax */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Calculator className="h-5 w-5 text-slate-500" />
            消費税
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="standardTaxRate">標準税率</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="standardTaxRate"
                  type="number"
                  step="0.1"
                  value={settings.standardTaxRate}
                  onChange={(e) => updateSetting("standardTaxRate", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500">請求計算に使用</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reducedTaxRate">軽減税率</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="reducedTaxRate"
                  type="number"
                  step="0.1"
                  value={settings.reducedTaxRate}
                  onChange={(e) => updateSetting("reducedTaxRate", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500">通常は使用しないが将来対応用</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Social Insurance Rates */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-slate-500" />
            社会保険料率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="healthInsurance">健康保険料率（事業主負担）</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="healthInsurance"
                  type="number"
                  step="0.01"
                  value={settings.healthInsurance}
                  onChange={(e) => updateSetting("healthInsurance", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500">都道府県ごとに異なる</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pensionInsurance">厚生年金保険料率（事業主負担）</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pensionInsurance"
                  type="number"
                  step="0.01"
                  value={settings.pensionInsurance}
                  onChange={(e) => updateSetting("pensionInsurance", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentInsuranceEmployer">雇用保険料率（事業主負担）</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="employmentInsuranceEmployer"
                  type="number"
                  step="0.01"
                  value={settings.employmentInsuranceEmployer}
                  onChange={(e) => updateSetting("employmentInsuranceEmployer", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentInsuranceWorker">雇用保険料率（労働者負担）</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="employmentInsuranceWorker"
                  type="number"
                  step="0.01"
                  value={settings.employmentInsuranceWorker}
                  onChange={(e) => updateSetting("employmentInsuranceWorker", e.target.value)}
                  className="max-w-28 tabular-nums"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500">給与控除に使用</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Default Unit Prices by Employment Type */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-slate-500" />
            雇用形態別デフォルト単価
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-600">雇用形態</TableHead>
                  <TableHead className="text-slate-600 text-right">フル単価（デフォルト）</TableHead>
                  <TableHead className="text-slate-600 text-right">ハーフ単価（デフォルト）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitPrices.map((up) => (
                  <TableRow key={up.id}>
                    <TableCell>
                      <Input
                        value={up.employmentType}
                        onChange={(e) =>
                          setUnitPrices((prev) =>
                            prev.map((p) =>
                              p.id === up.id
                                ? { ...p, employmentType: e.target.value }
                                : p
                            )
                          )
                        }
                        className="max-w-40"
                        placeholder="雇用形態名"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-slate-500">¥</span>
                        <Input
                          type="number"
                          value={up.fullRate}
                          onChange={(e) => updateUnitPrice(up.id, "fullRate", e.target.value)}
                          className="max-w-28 text-right tabular-nums"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-slate-500">¥</span>
                        <Input
                          type="number"
                          value={up.halfRate}
                          onChange={(e) => updateUnitPrice(up.id, "halfRate", e.target.value)}
                          className="max-w-28 text-right tabular-nums"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addUnitPrice}
            className="mt-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            雇用形態を追加
          </Button>
        </CardContent>
      </Card>

      {/* Section 4: Default Allowances */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <Gift className="h-5 w-5 text-slate-500" />
            デフォルト手当
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-600">手当名</TableHead>
                  <TableHead className="text-slate-600 text-right whitespace-nowrap">金額/料率</TableHead>
                  <TableHead className="text-slate-600">タイプ</TableHead>
                  <TableHead className="text-slate-600">説明</TableHead>
                  <TableHead className="text-slate-600 w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allowances.map((allowance) => (
                  <TableRow key={allowance.id}>
                    <TableCell className="font-medium text-slate-900">{allowance.name}</TableCell>
                    <TableCell className="text-right whitespace-nowrap tabular-nums">{allowance.amount}</TableCell>
                    <TableCell className="text-slate-600">{allowance.type}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{allowance.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAllowanceModal(allowance)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openAllowanceModal()}
            className="mt-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            手当を追加
          </Button>
          <p className="text-xs text-slate-500 mt-3">
            ここで設定するのはデフォルト値です。作業員ごとの個別設定はマスタ管理 &gt; 作業員タブで行います。
          </p>
        </CardContent>
      </Card>

      {/* Section 5: Payroll Cutoff & Payment Days */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
            <CalendarDays className="h-5 w-5 text-slate-500" />
            給与締め日・支払日
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payrollCutoffDay">給与締め日</Label>
              <Select
                value={settings.payrollCutoffDay}
                onValueChange={(value) => updateSetting("payrollCutoffDay", value)}
              >
                <SelectTrigger id="payrollCutoffDay" className="max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="月末">月末</SelectItem>
                  <SelectItem value="20日">20日</SelectItem>
                  <SelectItem value="25日">25日</SelectItem>
                  <SelectItem value="15日">15日</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payrollPaymentDay">給与支払日</Label>
              <Select
                value={settings.payrollPaymentDay}
                onValueChange={(value) => updateSetting("payrollPaymentDay", value)}
              >
                <SelectTrigger id="payrollPaymentDay" className="max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="翌月5日">翌月5日</SelectItem>
                  <SelectItem value="翌月10日">翌月10日</SelectItem>
                  <SelectItem value="翌月15日">翌月15日</SelectItem>
                  <SelectItem value="翌月末">翌月末</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Allowance Edit Modal */}
      <Dialog open={showAllowanceModal} onOpenChange={setShowAllowanceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAllowance && initialAllowances.find((a) => a.id === editingAllowance.id)
                ? "手当を編集"
                : "手当を追加"}
            </DialogTitle>
          </DialogHeader>
          {editingAllowance && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>手当名</Label>
                <Input
                  value={editingAllowance.name}
                  onChange={(e) =>
                    setEditingAllowance({ ...editingAllowance, name: e.target.value })
                  }
                  placeholder="手当名を入力"
                />
              </div>
              <div className="space-y-2">
                <Label>金額/料率</Label>
                <Input
                  value={editingAllowance.amount}
                  onChange={(e) =>
                    setEditingAllowance({ ...editingAllowance, amount: e.target.value })
                  }
                  placeholder="¥2,000 または 25%"
                />
              </div>
              <div className="space-y-2">
                <Label>タイプ</Label>
                <Select
                  value={editingAllowance.type}
                  onValueChange={(value) =>
                    setEditingAllowance({ ...editingAllowance, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="固定額 / 現場">固定額 / 現場</SelectItem>
                    <SelectItem value="固定額 / 回">固定額 / 回</SelectItem>
                    <SelectItem value="料率">料率</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>説明</Label>
                <Input
                  value={editingAllowance.description}
                  onChange={(e) =>
                    setEditingAllowance({ ...editingAllowance, description: e.target.value })
                  }
                  placeholder="補足説明（任意）"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllowanceModal(false)}>
              キャンセル
            </Button>
            <Button onClick={saveAllowance} className="bg-blue-600 hover:bg-blue-700 text-white">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
