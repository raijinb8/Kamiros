"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SidebarProvider, useSidebar } from "./sidebar-context"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main
      className={cn(
        "min-h-screen pt-16 transition-all duration-300 ease-in-out bg-slate-50",
        isCollapsed ? "pl-20" : "pl-64",
      )}
    >
      <div className="p-6">{children}</div>
    </main>
  )
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
}
