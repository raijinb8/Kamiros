"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyInfoTab } from "@/components/settings/company-info-tab"
import { PayrollTaxTab } from "@/components/settings/payroll-tax-tab"
import { EmailFaxTab } from "@/components/settings/email-fax-tab"
import { UserManagementTab } from "@/components/settings/user-management-tab"
import { PermissionsTab } from "@/components/settings/permissions-tab"
import { Toaster } from "sonner"

export default function SettingsPage() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">設定</h1>
        <p className="text-sm text-slate-500 mt-1">
          会社全体の設定を管理します
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 h-10 flex-wrap">
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            会社情報
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            給与・税設定
          </TabsTrigger>
          <TabsTrigger
            value="email-fax"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            メール・FAX設定
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            ユーザー管理
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-sm"
          >
            権限管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <CompanyInfoTab />
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <PayrollTaxTab />
        </TabsContent>

        <TabsContent value="email-fax" className="mt-4">
          <EmailFaxTab />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <PermissionsTab />
        </TabsContent>
      </Tabs>

      <Toaster position="top-right" richColors />
    </div>
  )
}
