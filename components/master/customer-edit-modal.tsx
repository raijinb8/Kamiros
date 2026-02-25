"use client"

import { useEffect } from "react"
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
import type { Customer } from "@/lib/master-data"
import { houseMakers } from "@/lib/master-data"

const customerSchema = z.object({
  name: z.string().min(1, "得意先名は必須です"),
  housemaker: z.string().min(1, "ハウスメーカーを選択してください"),
  postalCode: z.string(),
  address: z.string().min(1, "住所は必須です"),
  phone: z.string(),
  fax: z.string(),
  email: z.string(),
  contactPerson: z.string(),
  startDate: z.string(),
  fullPrice: z.coerce.number().min(0, "0以上を入力してください"),
  halfPrice: z.coerce.number().min(0, "0以上を入力してください"),
  closingDay: z.string(),
  paymentSite: z.string(),
  taxCalcMethod: z.string(),
  invoiceNumber: z.string(),
  invoiceSendMethod: z.string(),
  invoiceSendTo: z.string(),
  notes: z.string(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerEditModalProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer) => void
}

export function CustomerEditModal({ customer, open, onOpenChange, onSave }: CustomerEditModalProps) {
  const isEdit = !!customer

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      housemaker: "",
      postalCode: "",
      address: "",
      phone: "",
      fax: "",
      email: "",
      contactPerson: "",
      startDate: "",
      fullPrice: 0,
      halfPrice: 0,
      closingDay: "月末",
      paymentSite: "翌月末",
      taxCalcMethod: "案件ごと（税込）",
      invoiceNumber: "",
      invoiceSendMethod: "メール",
      invoiceSendTo: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (customer) {
        form.reset({
          name: customer.name,
          housemaker: customer.housemaker,
          postalCode: customer.postalCode,
          address: customer.address,
          phone: customer.phone,
          fax: customer.fax,
          email: customer.email,
          contactPerson: customer.contactPerson,
          startDate: customer.startDate,
          fullPrice: customer.fullPrice,
          halfPrice: customer.halfPrice,
          closingDay: customer.closingDay,
          paymentSite: customer.paymentSite,
          taxCalcMethod: customer.taxCalcMethod,
          invoiceNumber: customer.invoiceNumber,
          invoiceSendMethod: customer.invoiceSendMethod,
          invoiceSendTo: customer.invoiceSendTo,
          notes: customer.notes,
        })
      } else {
        form.reset({
          name: "",
          housemaker: "",
          postalCode: "",
          address: "",
          phone: "",
          fax: "",
          email: "",
          contactPerson: "",
          startDate: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
          fullPrice: 0,
          halfPrice: 0,
          closingDay: "月末",
          paymentSite: "翌月末",
          taxCalcMethod: "案件ごと（税込）",
          invoiceNumber: "",
          invoiceSendMethod: "メール",
          invoiceSendTo: "",
          notes: "",
        })
      }
    }
  }, [open, customer, form])

  const onSubmit = (values: CustomerFormValues) => {
    const newCode = customer?.code || `C-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`
    const saved: Customer = {
      id: customer?.id || `c-${Date.now()}`,
      code: newCode,
      name: values.name,
      housemaker: values.housemaker,
      fullPrice: values.fullPrice,
      halfPrice: values.halfPrice,
      phone: values.phone,
      closingDay: values.closingDay as Customer["closingDay"],
      monthlyProjects: customer?.monthlyProjects || 0,
      status: customer?.status || "有効",
      postalCode: values.postalCode,
      address: values.address,
      fax: values.fax,
      email: values.email,
      contactPerson: values.contactPerson,
      startDate: values.startDate,
      paymentSite: values.paymentSite as Customer["paymentSite"],
      taxCalcMethod: values.taxCalcMethod as Customer["taxCalcMethod"],
      invoiceNumber: values.invoiceNumber,
      invoiceSendMethod: values.invoiceSendMethod as Customer["invoiceSendMethod"],
      invoiceSendTo: values.invoiceSendTo,
      monthlyBillingEstimate: customer?.monthlyBillingEstimate || 0,
      lastMonthBilling: customer?.lastMonthBilling || 0,
      yearlyBillingTotal: customer?.yearlyBillingTotal || 0,
      notes: values.notes,
      history: customer?.history || [
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
            {isEdit ? "得意先を編集" : "得意先を新規登録"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {isEdit ? `${customer.code} - ${customer.name}` : "新しい得意先の情報を入力してください。"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">基本情報</h3>
              <div className="grid grid-cols-2 gap-4">
                {isEdit && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-medium text-slate-600">得意先コード</label>
                    <Input value={customer.code} readOnly className="h-9 text-sm bg-slate-50 mt-1" />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className={isEdit ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        得意先名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 加藤ベニヤ 本社" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="housemaker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        ハウスメーカー <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {houseMakers.map((hm) => (
                            <SelectItem key={hm.id} value={hm.name}>{hm.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FormLabel className="text-xs font-medium text-slate-600">
                        住所 <span className="text-red-500">*</span>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">電話番号</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">FAX番号</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">メールアドレス</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" type="email" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">担当者名</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">取引開始日</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" placeholder="例: 2026/01/01" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Sales Unit Price */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">売上単価</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">
                        フル単価 <span className="text-red-500">*</span>
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
                      <FormLabel className="text-xs font-medium text-slate-600">
                        ハーフ単価 <span className="text-red-500">*</span>
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
              </div>
            </div>

            <Separator />

            {/* Section 3: Billing Settings */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">請求設定</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="closingDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">締め日</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="月末">月末</SelectItem>
                          <SelectItem value="20日">20日</SelectItem>
                          <SelectItem value="25日">25日</SelectItem>
                          <SelectItem value="15日">15日</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">支払サイト</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="翌月末">翌月末</SelectItem>
                          <SelectItem value="翌々月末">翌々月末</SelectItem>
                          <SelectItem value="翌月20日">翌月20日</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxCalcMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">消費税計算方式</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="案件ごと（税込）">案件ごと（税込）</SelectItem>
                          <SelectItem value="案件ごと（税抜）">案件ごと（税抜）</SelectItem>
                          <SelectItem value="請求書一括">請求書一括</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">インボイス番号</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm font-mono" placeholder="T1234567890123" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceSendMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">請求書送付方法</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="メール">メール</SelectItem>
                          <SelectItem value="郵送">郵送</SelectItem>
                          <SelectItem value="FAX">FAX</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceSendTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600">請求書送付先メール</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-sm" type="email" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 4: Notes */}
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
