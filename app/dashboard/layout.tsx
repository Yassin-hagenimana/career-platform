"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, BookOpen, Calendar, User } from "lucide-react"
import { useSupabase } from "@/hooks/use-Supabase" // Ensure this hook provides supabase context

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { supabase } = useSupabase()

  // Use effect to check session and fetch profile once
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (!session) {
        router.push("/auth/login?redirect=/dashboard") // Redirect if not logged in
      } else {
        const { data: userProfile } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", session.user.id)
          .single()

        setProfile(userProfile)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      if (!session) {
        router.push("/auth/login?redirect=/dashboard") // Redirect if not logged in
      } else {
        const { data: userProfile } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", session.user.id)
          .single()

        setProfile(userProfile)
      }
    })

    // No need for manual cleanup

  }, [supabase, router])

  // If loading or session not found, return a loading state
  if (loading) {
    return <div>Loading...</div>
  }

  // Navigation items (No session check here, just rendering links)
  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { title: "Profile", href: "/dashboard/profile", icon: "user" },
    { title: "Mentors", href: "/dashboard/mentors", icon: "users" },
    { title: "Jobs", href: "/dashboard/jobs", icon: "briefcase" },
    { title: "Courses", href: "/dashboard/courses", icon: "book-open" },
    { title: "Workshops", href: "/dashboard/workshops", icon: "calendar" },
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
           {/* <div className="p-4 mt-auto">
              <form action="/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </form>
            </div> */}
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

