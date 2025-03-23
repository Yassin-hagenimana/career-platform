"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MessageSquare} from "lucide-react"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, BookOpen, Calendar, User } from "lucide-react"
import { useSupabase } from "@/hooks/use-Supabase" // Ensure this hook provides supabase context

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true) // Start loading
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Session fetch error:", sessionError)
        setLoading(false)
        return
      }

      const currentSession = sessionData.session

      if (!currentSession) {
        router.replace("/auth/login?redirect=/dashboard")
        setLoading(false)
        return
      }

      setSession(currentSession)

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("name, avatar_url")
        .eq("id", currentSession.user.id)
        .single()

      if (profileError) {
        console.error("Profile fetch error:", profileError)
      } else {
        setProfile(userProfile)
      }

      setLoading(false)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession)

      if (!updatedSession) {
        router.replace("/auth/login?redirect=/dashboard")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { title: "Profile", href: "/dashboard/profile", icon: "user" },
    { title: "Mentors", href: "/dashboard/mentors", icon: "users" },
    { title: "Jobs", href: "/dashboard/jobs", icon: "briefcase" },
    { title: "Courses", href: "/dashboard/courses", icon: "book-open" },
    { title: "Workshops", href: "/dashboard/workshops", icon: "calendar" },
    {title: "Contact Messages",href: "/dashboard/contact-messages",icon: MessageSquare,
    },
    { title: "Settings", href: "/dashboard/settings", icon: "settings" },

  ]

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
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}