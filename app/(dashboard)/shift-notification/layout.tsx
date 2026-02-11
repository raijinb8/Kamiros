import type React from "react"
import { ShiftProvider } from "@/lib/shift-context"

export default function ShiftNotificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ShiftProvider>{children}</ShiftProvider>
}
