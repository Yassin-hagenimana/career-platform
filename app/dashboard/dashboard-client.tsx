"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, BookOpen, Calendar, User } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: string
}

interface DashboardClientProps {
  children: React.ReactNode
  navItems: NavItem[]
  profile: any
}

export default function DashboardClient({ children, navItems, profile }: DashboardClientProps) {
  const iconMap = {
    "layout-dashboard": LayoutDashboard,
    user: User,
    users: Users,
    briefcase: Briefcase,
    "book-open": BookOpen,
    calendar: Calendar,
    settings: Settings,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-muted/40 hidden md:block">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 mt-auto">
              <form action="/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

