"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerTab } from "@/components/master/customer-tab"
import { WorkerTab } from "@/components/master/worker-tab"
import { HousemakerTab } from "@/components/master/housemaker-tab"
import { Toaster } from "sonner"

export default function MasterPage() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">マスタ管理</h1>
        <p className="text-sm text-slate-500 mt-1">
          得意先・作業員・ハウスメーカーの基本情報を管理します
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10">
          <TabsTrigger
            value="customers"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            得意先
          </TabsTrigger>
          <TabsTrigger
            value="workers"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            作業員
          </TabsTrigger>
          <TabsTrigger
            value="housemakers"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            ハウスメーカー
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-4">
          <CustomerTab />
        </TabsContent>

        <TabsContent value="workers" className="mt-4">
          <WorkerTab />
        </TabsContent>

        <TabsContent value="housemakers" className="mt-4">
          <HousemakerTab />
        </TabsContent>
      </Tabs>

      <Toaster position="top-right" richColors />
    </div>
  )
}
