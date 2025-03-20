"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare, ThumbsUp, Eye, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useSupabase } from "@/hooks/use-supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CreateDiscussionDialog } from "./create-discussion-dialog"

export default function DashboardCommunityPage() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [myDiscussions, setMyDiscussions] = useState<any[]>([])
  const [participatedDiscussions, setParticipatedDiscussions] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const fetchCommunityData = async () => {
      setIsLoading(true)
      try {
        // Fetch discussions created by the user
        const { data: myDiscData, error: myDiscError } = await supabase
          .from("discussions")
          .select(`
            id,
            title,
            category,
            replies,
            views,
            likes,
            created_at,
            last_activity
          `)
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })

        if (myDiscError) throw myDiscError

        // Fetch discussions the user has participated in
        const { data: commentedDiscIds, error: commentedError } = await supabase
          .from("discussion_comments")
          .select("discussion_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (commentedError) throw commentedError

        // Get unique discussion IDs
        const uniqueDiscIds = [...new Set(commentedDiscIds.map((item) => item.discussion_id))]

        let participatedData: any[] = []
        if (uniqueDiscIds.length > 0) {
          // Fetch the actual discussions
          const { data: participatedDiscs, error: participatedError } = await supabase
            .from("discussions")
            .select(`
              id,
              title,
              category,
              replies,
              views,
              likes,
              created_at,
              last_activity,
              author_id,
              users (
                id,
                name,
                avatar_url
              )
            `)
            .in("id", uniqueDiscIds)
            .order("last_activity", { ascending: false })

          if (participatedError) throw participatedError

          // Count user's replies for each discussion
          const replyCounts = await Promise.all(
            participatedDiscs.map(async (disc) => {
              const { count, error } = await supabase
                .from("discussion_comments")
                .select("id", { count: "exact" })
                .eq("discussion_id", disc.id)
                .eq("user_id", user.id)

              return {
                discussionId: disc.id,
                count: count || 0,
              }
            }),
          )

          // Add reply counts to discussions
          participatedData = participatedDiscs.map((disc) => ({
            ...disc,
            yourReplies: replyCounts.find((rc) => rc.discussionId === disc.id)?.count || 0,
          }))
        }

        // Fetch connections (simplified for now)
        const { data: connectionsData, error: connectionsError } = await supabase
          .from("users")
          .select("id, name, avatar_url, role, location")
          .neq("id", user.id)
          .limit(3)

        if (connectionsError) throw connectionsError

        setMyDiscussions(myDiscData || [])
        setParticipatedDiscussions(participatedData || [])
        setConnections(
          connectionsData.map((user) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar_url || "/placeholder.svg?height=100&width=100",
            role: user.role || "Member",
            location: user.location || "Unknown",
          })),
        )
      } catch (error) {
        console.error("Error fetching community data:", error)
        toast({
          title: "Error",
          description: "Failed to load community data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunityData()
  }, [user, supabase, toast])

  if (!user) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your community dashboard.</p>
          <Button asChild>
            <Link href="/auth/login?redirect=/dashboard/community">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Community</h1>
          <p className="text-muted-foreground">Manage your discussions, connections, and community activity</p>
        </div>
        <div className="flex gap-2">
          <CreateDiscussionDialog />
          <Button asChild>
            <Link href="/community">Go to Community</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="discussions" className="space-y-8">
            <TabsList>
              <TabsTrigger value="discussions">My Discussions</TabsTrigger>
              <TabsTrigger value="participated">Participated</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Discussions You Started</h2>
                <CreateDiscussionDialog />
              </div>

              {isLoading ? (
                <DiscussionsSkeleton count={2} />
              ) : myDiscussions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't started any discussions yet.</p>
                    <CreateDiscussionDialog />
                  </CardContent>
                </Card>
              ) : (
                myDiscussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg hover:text-primary">
                            <Link href={`/community/discussion/${discussion.id}`}>{discussion.title}</Link>
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {discussion.category}
                            </Badge>
                            <span>Started by you</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          <span>{discussion.replies || 0} replies</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4" />
                          <span>{discussion.views || 0} views</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          <span>{discussion.likes || 0} likes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Last activity {new Date(discussion.last_activity).toLocaleDateString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="participated" className="space-y-4">
              <h2 className="text-xl font-semibold">Discussions You've Participated In</h2>

              {isLoading ? (
                <DiscussionsSkeleton count={2} />
              ) : participatedDiscussions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No participated discussions</h3>
                    <p className="text-muted-foreground mb-4">You haven't participated in any discussions yet.</p>
                    <Button asChild>
                      <Link href="/community">Browse Discussions</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                participatedDiscussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg hover:text-primary">
                            <Link href={`/community/discussion/${discussion.id}`}>{discussion.title}</Link>
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {discussion.category}
                            </Badge>
                            <span>Started by {discussion.users?.name || "Unknown"}</span>
                          </CardDescription>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={discussion.users?.avatar_url || "/placeholder.svg?height=40&width=40"}
                            alt={discussion.users?.name || "User"}
                          />
                          <AvatarFallback>
                            {discussion.users?.name ? discussion.users.name.charAt(0) : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          <span>{discussion.replies || 0} replies</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4" />
                          <span>{discussion.views || 0} views</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          <span>{discussion.likes || 0} likes</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Your replies: {discussion.yourReplies || 0}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Last activity {new Date(discussion.last_activity).toLocaleDateString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>My Connections</CardTitle>
              <CardDescription>People you've connected with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <ConnectionsSkeleton count={3} />
              ) : connections.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No connections yet</p>
                </div>
              ) : (
                connections.map((connection) => (
                  <div key={connection.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-sm text-muted-foreground">{connection.role}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Message
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/community">Find More Connections</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <StatsSkeleton />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Discussions Started</span>
                    <span className="font-medium">{myDiscussions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Discussions Participated</span>
                    <span className="font-medium">{participatedDiscussions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Replies</span>
                    <span className="font-medium">
                      {participatedDiscussions.reduce((total, discussion) => total + (discussion.yourReplies || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">{connections.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DiscussionsSkeleton({ count = 2 }) {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-64" />
                  <div className="flex items-center mt-1">
                    <Skeleton className="h-5 w-24 mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-4 w-48" />
            </CardFooter>
          </Card>
        ))}
    </>
  )
}

function ConnectionsSkeleton({ count = 3 }) {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
    </>
  )
}

function StatsSkeleton() {
  return (
    <div className="space-y-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
    </div>
  )
}

