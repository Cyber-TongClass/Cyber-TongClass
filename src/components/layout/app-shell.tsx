"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}
