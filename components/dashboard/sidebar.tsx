"use client"

import { Suspense, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Inbox, Send, Settings, ClipboardList, FileCheck, Receipt, Wallet, FileQuestion, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  separator?: never
  badge?: number
} | {
  separator: true
  label?: never
  icon?: never
  href?: never
  badge?: never
}

const navItems: NavItem[] = [
  {
    label: "ダッシュボード",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "FAX受信・確認",
    icon: Inbox,
    href: "/fax-inbox",
  },
  {
    label: "案件管理",
    icon: ClipboardList,
    href: "/projects",
  },
  {
    label: "シフト連絡",
    icon: Send,
    href: "/shift-notification",
  },
  {
    label: "現場終了報告",
    icon: FileCheck,
    href: "/site-reports",
  },
  {
    label: "申請管理",
    icon: FileQuestion,
    href: "/requests",
    badge: 16,
  },
  {
    label: "請求管理",
    icon: Receipt,
    href: "/billing",
  },
  {
    label: "給与管理",
    icon: Wallet,
    href: "/payroll",
  },
  { separator: true },
  {
    label: "マスタ管理",
    icon: Database,
    href: "/master",
  },
  {
    label: "設定",
    icon: Settings,
    href: "/settings",
  },
]

function SidebarNav() {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3 mt-4">
      {navItems.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={`sep-${index}`}
              className={cn("my-2 border-t border-slate-700", isCollapsed ? "mx-2" : "mx-3")}
            />
          )
        }

        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-slate-300 hover:text-white hover:bg-slate-800",
              isActive && "bg-slate-700 text-white border-l-4 border-blue-500 -ml-0.5 pl-2.5",
              isCollapsed && "justify-center px-2",
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-blue-400")} />
            {!isCollapsed && (
              <span className="truncate flex-1">{item.label}</span>
            )}
            {!isCollapsed && item.badge != null && item.badge > 0 && (
              <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-semibold leading-none">
                {item.badge}
              </span>
            )}
            {isCollapsed && item.badge != null && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[9px] font-semibold leading-none">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export const Sidebar = memo(function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-slate-900 transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <Suspense fallback={null}>
        <SidebarNav />
      </Suspense>
    </aside>
  )
})
