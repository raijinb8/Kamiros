"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Plus, X } from "lucide-react"
import type { Worker, EmploymentType } from "@/lib/master-data"

const DEFAULTS: Record<EmploymentType, { fullPrice: number; halfPrice: number }> = {
  "アルバイト": { fullPrice: 9000, halfPrice: 6000 },
  "個人事業主": { fullPrice: 11200, halfPrice: 8200 },
}

const workerSchema = z.object({
  name: z.string().min(1, "氏名は必須です"),
  furigana: z.string().min(1, "フリガナは必須です"),
  birthDate: z.string(),
  phone: z.string().min(1, "電話番号は必須です"),
  email: z.string().min(1, "メールアドレスは必須です"),
  postalCode: z.string(),
  address: z.string(),
  nearestStation: z.string(),
  employmentType: z.string().min(1, "雇用形態を選択してください"),
  startDate: z.string().min(1, "入社日は必須です"),
  emergencyContact: z.string(),
  fullPrice: z.coerce.number().min(0),
  halfPrice: z.coerce.number().min(0),
  distanceAllowance: z.coerce.number().min(0),
  earlyAllowance: z.coerce.number().min(0),
  holidayAllowanceRate: z.coerce.number().min(0),
  bankName: z.string(),
  branchName: z.string(),
  accountType: z.string(),
  accountNumber: z.string(),
  accountHolder: z.string(),
  annualLeave: z.coerce.number().min(0),
  nextLeaveDate: z.string(),
  notes: z.string(),
})

type WorkerFormValues = z.infer<typeof workerSchema>

interface WorkerEditModalProps {
  worker: Worker | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (worker: Worker) => void
}

export function WorkerEditModal({ worker, open, onOpenChange, onSave }: WorkerEditModalProps) {
  const isEdit = !!worker
  const [qualifications, setQualifications] = useState<string[]>([])
  const [newQualification, setNewQualification] = useState("")
  const [customAllowances, setCustomAllowances] = useState<{ name: string; value: string }[]>([])

  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      furigana: "",
      birthDate: "",
      phone: "",
      email: "",
      postalCode: "",
      address: "",
      nearestStation: "",
      employmentType: "",
      startDate: "",
      emergencyContact: "",
      fullPrice: 0,
      halfPrice: 0,
      distanceAllowance: 2000,
      earlyAllowance: 1500,
      holidayAllowanceRate: 25,
      bankName: "",
      branchName: "",
      accountType: "普通",
      accountNumber: "",
      accountHolder: "",
      annualLeave: 0,
      nextLeaveDate: "",
      notes: "",
    },
  })

  const currentEmploymentType = form.watch("employmentType") as EmploymentType
  const currentFullPrice = form.watch("fullPrice")
  const currentHalfPrice = form.watch("halfPrice")

  const isCustomFullPrice = currentEmploymentType && DEFAULTS[currentEmploymentType]
    ? currentFullPrice !== DEFAULTS[currentEmploymentType].fullPrice
    : false
  const isCustomHalfPrice = currentEmploymentType && DEFAULTS[currentEmploymentType]
    ? currentHalfPrice !== DEFAULTS[currentEmploymentType].halfPrice
    : false

  useEffect(() => {
    if (open) {
      if (worker) {
        form.reset({
          name: worker.name,
          furigana: worker.furigana,
          birthDate: worker.birthDate,
          phone: worker.phone,
          email: worker.email,
          postalCode: worker.postalCode,
          address: worker.address,
          nearestStation: worker.nearestStation,
          employmentType: worker.employmentType,
          startDate: worker.startDate,
          emergencyContact: worker.emergencyContact,
          fullPrice: worker.fullPrice,
          halfPrice: worker.halfPrice,
          distanceAllowance: worker.distanceAllowance,
          earlyAllowance: worker.earlyAllowance,
          holidayAllowanceRate: worker.holidayAllowanceRate,
          bankName: worker.bankName,
          branchName: worker.branchName,
          accountType: worker.accountType,
          accountNumber: worker.accountNumber,
          accountHolder: worker.accountHolder,
          annualLeave: worker.annualLeave,
          nextLeaveDate: worker.nextLeaveDate,
          notes: worker.notes,
        })
        setQualifications(worker.qualifications)
      } else {
        form.reset({
          name: "",
          furigana: "",
          birthDate: "",
          phone: "",
          email: "",
          postalCode: "",
          address: "",
          nearestStation: "",
          employmentType: "",
          startDate: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
          emergencyContact: "",
          fullPrice: 0,
          halfPrice: 0,
          distanceAllowance: 2000,
          earlyAllowance: 1500,
          holidayAllowanceRate: 25,
          bankName: "",
          branchName: "",
          accountType: "普通",
          accountNumber: "",
          accountHolder: "",
          annualLeave: 0,
          nextLeaveDate: "",
          notes: "",
        })
        setQualifications([])
      }
      setCustomAllowances([])
    }
  }, [open, worker, form])

  // Auto-fill default prices when employment type changes
  const handleEmploymentTypeChange = (value: string) => {
    form.setValue("employmentType", value)
    if (!isEdit || (isEdit && form.getValues("fullPrice") === 0)) {
      const defaults = DEFAULTS[value as EmploymentType]
      if (defaults) {
        form.setValue("fullPrice", defaults.fullPrice)
        form.setValue("halfPrice", defaults.halfPrice)
      }
    }
  }

  const addQualification = () => {
    const q = newQualification.trim()
    if (q && !qualifications.includes(q)) {
      setQualifications((prev) => [...prev, q])
      setNewQualification("")
    }
  }

  const removeQualification = (index: number) => {
    setQualifications((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (values: WorkerFormValues) => {
    const saved: Worker = {
      id: worker?.id || `w-${Date.now()}`,
      no: worker?.no || Math.floor(Math.random() * 100) + 26,
      name: values.name,
      furigana: values.furigana,
      employmentType: values.employmentType as EmploymentType,
      fullPrice: values.fullPrice,
      halfPrice: values.halfPrice,
      distanceAllowance: values.distanceAllowance,
      phone: values.phone,
      startDate: values.startDate,
      monthlyWork: worker?.monthlyWork || "0H",
      monthlyAdvance: worker?.monthlyAdvance || 0,
      status: worker?.status || "在籍",
      birthDate: values.birthDate,
      email: values.email,
      postalCode: values.postalCode,
      address: values.address,
      nearestStation: values.nearestStation,
      qualifications,
      emergencyContact: values.emergencyContact,
      earlyAllowance: values.earlyAllowance,
      holidayAllowanceRate: values.holidayAllowanceRate,
      bankName: values.bankName,
      branchName: values.branchName,
      accountType: values.accountType as Worker["accountType"],
      accountNumber: values.accountNumber,
      accountHolder: values.accountHolder,
      annualLeave: values.annualLeave,
      usedLeave: worker?.usedLeave || 0,
      remainingLeave: values.annualLeave - (worker?.usedLeave || 0),
      nextLeaveDate: values.nextLeaveDate,
      monthlyPayEstimate: worker?.monthlyPayEstimate || 0,
      notes: values.notes,
      history: worker?.history || [
        {
          datetime: new Date().toLocaleString("ja-JP"),
          operator: "事務担当者A",
          content: "新規登録",
        },
      ],
    }
    onSave(saved)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-900">
            {isEdit ? "作業員を編集" : "作業員を新規登録"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {isEdit ? `No.${worker.no} - ${worker.name}` : "新しい作業員の情報を入力してください。"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">基本情報</h3>
              <div className="grid grid-cols-2 gap-4">
                {isEdit && (
                  <div>
                    <label className="text-xs font-medium text-slate-600">作業員No.</label>
                    <Input value={worker.no.toString()} readOnly className="h-9 text-sm bg-slate-50 mt-1" />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        氏名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="furigana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        フリガナ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">生年月日</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 1990/01/01" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        電話番号 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        メールアドレス <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">郵便番号</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 332-0012" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-600">住所</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nearestStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">最寄り駅</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Employment Info */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">雇用情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        雇用形態 <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={handleEmploymentTypeChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="アルバイト">アルバイト</SelectItem>
                          <SelectItem value="個人事業主">個人事業主</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        入社日 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 2026/01/01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Qualifications as chips */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-600">資格</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                    {qualifications.map((q, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200 gap-1">
                        {q}
                        <button
                          type="button"
                          onClick={() => removeQualification(i)}
                          className="text-slate-400 hover:text-slate-600 ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      className="h-8 text-sm flex-1"
                      placeholder="資格名を入力"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addQualification()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={addQualification}>
                      <Plus className="h-3 w-3 mr-1" />
                      追加
                    </Button>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-600">緊急連絡先</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="氏名（続柄）電話番号" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 3: Pay Rates & Allowances */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">支払単価・手当</h3>
              {currentEmploymentType && (
                <p className="text-xs text-slate-500 mb-3">
                  デフォルト値は雇用形態に基づいています。この作業員だけ変更したい場合は上書きしてください。
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-2">
                        フル単価
                        {isCustomFullPrice && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]" variant="outline">カスタム</Badge>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">¥</span>
                          <Input {...field} type="number" className="h-9 text-sm pl-7 font-mono tabular-nums" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="halfPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-2">
                        ハーフ単価
                        {isCustomHalfPrice && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]" variant="outline">カスタム</Badge>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">¥</span>
                          <Input {...field} type="number" className="h-9 text-sm pl-7 font-mono tabular-nums" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distanceAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">遠方手当</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">¥</span>
                          <Input {...field} type="number" className="h-9 text-sm pl-7 font-mono tabular-nums" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="earlyAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">早出手当</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">¥</span>
                          <Input {...field} type="number" className="h-9 text-sm pl-7 font-mono tabular-nums" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="holidayAllowanceRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">祝日手当（%）</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type="number" className="h-9 text-sm pr-8 font-mono tabular-nums" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">%</span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom allowances */}
              {customAllowances.length > 0 && (
                <div className="mt-3 space-y-2">
                  {customAllowances.map((ca, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={ca.name}
                        onChange={(e) => {
                          const updated = [...customAllowances]
                          updated[i].name = e.target.value
                          setCustomAllowances(updated)
                        }}
                        className="h-8 text-sm flex-1"
                        placeholder="手当名"
                      />
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">¥</span>
                        <Input
                          value={ca.value}
                          onChange={(e) => {
                            const updated = [...customAllowances]
                            updated[i].value = e.target.value
                            setCustomAllowances(updated)
                          }}
                          className="h-8 text-sm pl-7 font-mono"
                          placeholder="金額"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                        onClick={() => setCustomAllowances((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 h-8 text-xs"
                onClick={() => setCustomAllowances((prev) => [...prev, { name: "", value: "" }])}
              >
                <Plus className="h-3 w-3 mr-1" />
                手当を追加
              </Button>
            </div>

            <Separator />

            {/* Section 4: Bank Account */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">給与・口座情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">銀行名</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">支店名</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">口座種別</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="普通">普通</SelectItem>
                          <SelectItem value="当座">当座</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">口座番号</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm font-mono" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountHolder"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-600">口座名義（カタカナ）</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 5: Paid Leave */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">有給休暇設定</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="annualLeave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">年間付与日数</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextLeaveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">付与基準日</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 2027/04/01" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 6: Notes */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">備考</h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} className="min-h-[80px] text-sm" placeholder="備考を入力..." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
