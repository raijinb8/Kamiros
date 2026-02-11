"use client"

import { Suspense, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Inbox, Send, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

const navItems = [
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
    label: "シフト連絡",
    icon: Send,
    href: "/shift-notification",
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
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-slate-300 hover:text-white hover:bg-slate-800",
              isActive && "bg-slate-700 text-white border-l-4 border-blue-500 -ml-0.5 pl-2.5",
              isCollapsed && "justify-center px-2",
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-blue-400")} />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
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
