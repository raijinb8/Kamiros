"use client"

import { memo, useState, useCallback, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FaxFormData } from "@/lib/fax-data"

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-slate-400 text-xs ml-1">(optional)</span>}
      </Label>
      {children}
    </div>
  )
}

interface FaxDetailFormProps {
  formData: FaxFormData
  onFieldChange: (field: keyof FaxFormData, value: string) => void
}

function FaxDetailFormInner({ formData, onFieldChange }: FaxDetailFormProps) {
  // Local draft state for text inputs to avoid parent re-render on every keystroke
  const [localDrafts, setLocalDrafts] = useState<Partial<Record<keyof FaxFormData, string>>>({})
  const [, startTransition] = useTransition()

  const getFieldValue = (field: keyof FaxFormData): string => {
    return localDrafts[field] ?? formData[field]
  }

  const handleChange = useCallback(
    (field: keyof FaxFormData, value: string) => {
      // Update local draft immediately (no parent re-render)
      setLocalDrafts((prev) => ({ ...prev, [field]: value }))
      // Defer the parent update via transition
      startTransition(() => {
        onFieldChange(field, value)
      })
    },
    [onFieldChange],
  )

  const handleBlur = useCallback(
    (field: keyof FaxFormData) => {
      // Clear local draft on blur - parent state is now the source of truth
      setLocalDrafts((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    [],
  )

  return (
    <div className="space-y-4">
      <FormField label="日時" required>
        <Input
          type="datetime-local"
          value={getFieldValue("dateTime")}
          onChange={(e) => handleChange("dateTime", e.target.value)}
          onBlur={() => handleBlur("dateTime")}
        />
      </FormField>

      <FormField label="取引先名" required>
        <Input
          value={getFieldValue("tradingPartner")}
          onChange={(e) => handleChange("tradingPartner", e.target.value)}
          onBlur={() => handleBlur("tradingPartner")}
          placeholder="例：ジューテック開発2"
        />
      </FormField>

      <FormField label="現場名" required>
        <Input
          value={getFieldValue("siteName")}
          onChange={(e) => handleChange("siteName", e.target.value)}
          onBlur={() => handleBlur("siteName")}
          placeholder="例：ライオンズマンション麹町501"
        />
      </FormField>

      <FormField label="ハウスメーカー">
        <Input
          value={getFieldValue("housemaker")}
          onChange={(e) => handleChange("housemaker", e.target.value)}
          onBlur={() => handleBlur("housemaker")}
          placeholder="例：朝日・マンション住替センター"
        />
      </FormField>

      <FormField label="住所">
        <Input
          value={getFieldValue("address")}
          onChange={(e) => handleChange("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          placeholder="例：千代田区麹町2-5-3"
        />
      </FormField>

      <FormField label="担当者の氏名">
        <Input
          value={getFieldValue("contactName")}
          onChange={(e) => handleChange("contactName", e.target.value)}
          onBlur={() => handleBlur("contactName")}
          placeholder="例：前田"
        />
      </FormField>

      <FormField label="担当者の連絡先">
        <Input
          value={getFieldValue("contactPhone")}
          onChange={(e) => handleChange("contactPhone", e.target.value)}
          onBlur={() => handleBlur("contactPhone")}
          placeholder="例：070-3277-6870"
        />
      </FormField>

      <FormField label="注意事項">
        <Textarea
          value={getFieldValue("notes")}
          onChange={(e) => handleChange("notes", e.target.value)}
          onBlur={() => handleBlur("notes")}
          placeholder="注意事項を入力してください"
          className="min-h-[80px]"
        />
      </FormField>

      <FormField label="作業内容">
        <Textarea
          value={getFieldValue("workContent")}
          onChange={(e) => handleChange("workContent", e.target.value)}
          onBlur={() => handleBlur("workContent")}
          placeholder="作業内容を入力してください"
          className="min-h-[80px]"
        />
      </FormField>

      <FormField label="最寄り駅">
        <Input
          value={getFieldValue("nearestStation")}
          onChange={(e) => handleChange("nearestStation", e.target.value)}
          onBlur={() => handleBlur("nearestStation")}
          placeholder="例：半蔵門駅"
        />
      </FormField>

      <FormField label="現場住所から最寄り駅までの徒歩距離">
        <div className="flex items-center gap-2">
          <Input
            value={getFieldValue("walkingDistance")}
            onChange={(e) => handleChange("walkingDistance", e.target.value)}
            onBlur={() => handleBlur("walkingDistance")}
            placeholder="例：110"
            className="w-32"
          />
          <span className="text-sm text-slate-600">m</span>
        </div>
      </FormField>

      <FormField label="人工（にんく）">
        <Input
          value={getFieldValue("workers")}
          onChange={(e) => handleChange("workers", e.target.value)}
          onBlur={() => handleBlur("workers")}
          placeholder="例：4名ハーフ作業"
        />
      </FormField>

      <FormField label="交通費">
        <div className="flex items-center gap-2">
          <Input
            value={getFieldValue("transportCost")}
            onChange={(e) => handleChange("transportCost", e.target.value)}
            onBlur={() => handleBlur("transportCost")}
            placeholder="例：5000"
            className="w-32"
          />
          <span className="text-sm text-slate-600">円</span>
        </div>
      </FormField>
    </div>
  )
}

export const FaxDetailForm = memo(FaxDetailFormInner)
