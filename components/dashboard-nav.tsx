"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  MessageSquare,
  Briefcase,
  LogOut,
  Menu,
  GraduationCap,
  CalendarDays,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardNavProps {
  activeItem?: string
}

export default function DashboardNav({ activeItem = "dashboard" }: DashboardNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      href: "/dashboard/courses",
      icon: GraduationCap,
    },
    {
      title: "Workshops",
      href: "/dashboard/workshops",
      icon: CalendarDays,
    },
    {
      title: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "Funding",
      href: "/dashboard/funding",
      icon: DollarSign,
    },
    {
      title: "Community",
      href: "/dashboard/community",
      icon: Users,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      badge: "3",
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    {
      title: "Contact Messages",
      href: "/dashboard/contact-messages",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full py-6">
            <div className="flex items-center gap-2 px-4 py-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>YH</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Yassin Hagenimana</p>
                <p className="text-xs text-muted-foreground">Job Seeker</p>
              </div>
            </div>
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      activeItem === item.title.toLowerCase()
                        ? "bg-muted font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="mt-6 px-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <div>
            <p className="text-sm font-medium">OVERVIEW</p>
          </div>
        </div>
        <ScrollArea className="flex-1 py-6">
          <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    activeItem === item.title.toLowerCase()
                      ? "bg-muted font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </>
  )
}

