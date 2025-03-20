"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/hooks/use-Supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { NewDiscussionDialog } from "./new-discussion-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { MessageSquare, Eye, ThumbsUp, Clock, Filter, Search } from "lucide-react"

export default function CommunityPageClient({
  discussions: initialDiscussions,
  popularDiscussions: initialPopularDiscussions,
  activeUsers: initialActiveUsers,
}) {
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [discussions, setDiscussions] = useState(initialDiscussions)
  const [popularDiscussions, setPopularDiscussions] = useState(initialPopularDiscussions)
  const [category, setCategory] = useState(searchParams.get("category") || "All")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeUsers, setActiveUsers] = useState(initialActiveUsers)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true)
      try {
        let query = supabase
          .from("discussions")
          .select("id, title, category, replies, views, likes, created_at, last_activity, author_id, users (id, name, avatar_url)")
          .order("last_activity", { ascending: false })

        if (category && category !== "All") {
          query = query.eq("category", category)
        }

        if (searchQuery) {
          query = query.ilike("title", `%${searchQuery}%`)
        }

        const { data: discussionsData } = await query.limit(20)

        setDiscussions(discussionsData || [])
      } catch (error) {
        console.error("Error fetching discussions:", error)
        toast({ title: "Error", description: "Failed to load discussions.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussions()
  }, [supabase, toast, category, searchQuery])

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Connect with other professionals, share knowledge, and grow your network</p>
        </div>
        <NewDiscussionDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search discussions..." className="pl-8" defaultValue={searchQuery} />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {isLoading ? <DiscussionsSkeleton count={5} /> : discussions.map((discussion) => <DiscussionCard key={discussion.id} discussion={discussion} />)}
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              {isLoading ? <DiscussionsSkeleton count={5} /> : popularDiscussions.map((discussion) => <DiscussionCard key={discussion.id} discussion={discussion} />)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function DiscussionCard({ discussion }) {
  const formattedDate = new Date(discussion.last_activity).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg hover:text-primary">
              <Link href={`/community/discussion/${discussion.id}`}>{discussion.title}</Link>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">{discussion.category}</Badge>
              <span>Started by {discussion.users?.name || "Unknown"}</span>
            </CardDescription>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={discussion.users?.avatar_url || "/placeholder.svg?height=40&width=40"} alt={discussion.users?.name || "User"} />
            <AvatarFallback>{discussion.users?.name ? discussion.users.name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center"><MessageSquare className="mr-1 h-4 w-4" /><span>{discussion.replies || 0} replies</span></div>
          <div className="flex items-center"><Eye className="mr-1 h-4 w-4" /><span>{discussion.views || 0} views</span></div>
          <div className="flex items-center"><ThumbsUp className="mr-1 h-4 w-4" /><span>{discussion.likes || 0} likes</span></div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-muted-foreground"><Clock className="mr-1 h-4 w-4" /><span>Last activity {formattedDate}</span></div>
      </CardFooter>
    </Card>
  )
}

function DiscussionsSkeleton({ count = 5 }) {
  return <>{Array(count).fill(null).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</>
}