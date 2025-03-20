"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, MessageCircle, ThumbsUp, Eye, Clock, Share2, Bookmark, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useSupabase } from "@/hooks/use-Supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const commentSchema = z.object({
  comment: z.string().min(5, {
    message: "Comment must be at least 5 characters.",
  }),
})

type CommentFormValues = z.infer<typeof commentSchema>

export default function DiscussionDetailPage({ params }: { params: { id: string } }) {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [discussion, setDiscussion] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [author, setAuthor] = useState<any>(null)
  const [relatedDiscussions, setRelatedDiscussions] = useState<any[]>([])

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  })

  useEffect(() => {
    const fetchDiscussionData = async () => {
      setIsLoading(true)
      try {
        // Fetch the discussion
        const { data: discussionData, error: discussionError } = await supabase
          .from("discussions")
          .select("*")
          .eq("id", params.id)
          .single()

        if (discussionError) throw discussionError

        // Increment view count
        await supabase.rpc("increment_discussion_views", { discussion_id: params.id })

        // Fetch the discussion content
        const { data: contentData, error: contentError } = await supabase
          .from("discussion_contents")
          .select("*")
          .eq("discussion_id", params.id)
          .single()

        if (contentError) throw contentError

        // Fetch the author
        const { data: authorData, error: authorError } = await supabase
          .from("users")
          .select("id, name, avatar_url, created_at")
          .eq("id", discussionData.author_id)
          .single()

        if (authorError) throw authorError

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            likes,
            author_id,
            user:author_id (
              id,
              name,
              avatar_url,
              role
            )
          `)
          .eq("discussion_id", params.id)
          .order("created_at", { ascending: true })

        if (commentsError) throw commentsError

        // Fetch related discussions
        const { data: relatedData, error: relatedError } = await supabase
          .from("discussions")
          .select(`
            id,
            title,
            category,
            replies,
            created_at,
            author_id,
            users (
              id,
              name,
              avatar_url
            )
          `)
          .eq("category", discussionData.category)
          .neq("id", params.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (relatedError) throw relatedError

        // Combine discussion and content
        const fullDiscussion = {
          ...discussionData,
          content: contentData.content,
        }

        setDiscussion(fullDiscussion)
        setAuthor({
          ...authorData,
          joinDate: `Member since ${new Date(authorData.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}`,
        })
        setComments(commentsData || [])
        setRelatedDiscussions(relatedData || [])
      } catch (error) {
        console.error("Error fetching discussion:", error)
        toast({
          title: "Error",
          description: "Failed to load discussion. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussionData()
  }, [params.id, supabase, toast])

  async function onSubmit(data: { comment: string }) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Insert the comment
      const { data: commentData, error } = await supabase
        .from("comments")
        .insert({
          discussion_id: params.id,
          author_id: user.id,
          content: data.comment,
        })
        .select(`
          id,
          content,
          created_at,
          likes,
          author_id,
          user:author_id (
            id,
            name,
            avatar_url,
            role
          )
        `)
        .single()

      if (error) throw error

      // Increment reply count
      await supabase.rpc("increment_discussion_replies", { discussion_id: params.id })

      // Update the discussion object
      setDiscussion({
        ...discussion,
        replies: (discussion.replies || 0) + 1,
        last_activity: new Date().toISOString(),
      })

      // Add the new comment to the list
      setComments([...comments, commentData])

      toast({
        title: "Success",
        description: "Your comment has been posted",
      })

      // Reset the form by clearing the textarea
      const commentTextarea = document.getElementById("comment") as HTMLTextAreaElement
      if (commentTextarea) {
        commentTextarea.value = ""
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLike() {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this discussion",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if user already liked this discussion
      const { data: existingLike } = await supabase
        .from("discussion_likes")
        .select("id")
        .eq("discussion_id", params.id)
        .eq("user_id", user.id)
        .maybeSingle()

      if (existingLike) {
        // Unlike
        await supabase.from("discussion_likes").delete().eq("id", existingLike.id)
        await supabase.rpc("decrement_discussion_likes", { discussion_id: params.id })
        setDiscussion({
          ...discussion,
          likes: discussion.likes - 1,
        })
      } else {
        // Like
        await supabase.from("discussion_likes").insert({
          discussion_id: params.id,
          user_id: user.id,
        })
        await supabase.rpc("increment_discussion_likes", { discussion_id: params.id })
        setDiscussion({
          ...discussion,
          likes: discussion.likes + 1,
        })
      }
    } catch (error) {
      console.error("Error liking discussion:", error)
      toast({
        title: "Error",
        description: "Failed to process your like. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleCommentLike(commentId: string, currentLikes: number) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this comment",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if user already liked this comment
      const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("id")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (existingLike) {
        // Unlike
        await supabase.from("comment_likes").delete().eq("id", existingLike.id)
        await supabase
          .from("comments")
          .update({ likes: currentLikes - 1 })
          .eq("id", commentId)

        // Update local state
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, likes: comment.likes - 1 }
            }
            return comment
          }),
        )
      } else {
        // Like
        await supabase.from("comment_likes").insert({
          comment_id: commentId,
          user_id: user.id,
        })
        await supabase
          .from("comments")
          .update({ likes: currentLikes + 1 })
          .eq("id", commentId)

        // Update local state
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, likes: comment.likes + 1 }
            }
            return comment
          }),
        )
      }
    } catch (error) {
      console.error("Error liking comment:", error)
      toast({
        title: "Error",
        description: "Failed to process your like. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <DiscussionSkeleton />
  }

  if (!discussion || !author) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
          <p className="text-muted-foreground mb-6">
            The discussion you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/community">Back to Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(discussion.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedLastActivity = new Date(discussion.last_activity).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discussions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Discussion Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {discussion.category}
                  </Badge>
                  <CardTitle className="text-2xl">{discussion.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Posted {formattedDate}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.avatar_url || "/placeholder.svg?height=40&width=40"} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{author.name}</div>
                  <div className="text-sm text-muted-foreground">{author.role || "Member"}</div>
                  <div className="text-xs text-muted-foreground">{author.joinDate}</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{discussion.content}</p>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <Button variant="ghost" size="sm" className="gap-1" onClick={handleLike}>
                  <ThumbsUp className="h-4 w-4" />
                  <span>{discussion.likes || 0} Likes</span>
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  <span>{discussion.replies || 0} replies</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="mr-1 h-4 w-4" />
                  <span>{discussion.views || 0} views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Replies ({comments.length})</h2>

            {comments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No replies yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to reply to this discussion!</p>
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={comment.user.avatar_url || "/placeholder.svg?height=40&width=40"}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{comment.user.name}</div>
                            <div className="text-sm text-muted-foreground">{comment.user.role || "Member"}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-3 whitespace-pre-line">{comment.content}</div>
                        <div className="flex items-center gap-4 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleCommentLike(comment.id, comment.likes)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{comment.likes || 0} Likes</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Comment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Your Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const commentText = e.currentTarget.comment.value
                    if (commentText.length < 5) {
                      toast({
                        title: "Validation Error",
                        description: "Comment must be at least 5 characters.",
                        variant: "destructive",
                      })
                      return
                    }
                    onSubmit({ comment: commentText })
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Share your thoughts or advice..."
                      className="min-h-[120px]"
                    />
                    {/* Error message would appear here if needed */}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !user}>
                      {isSubmitting ? (
                        "Posting..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Post Reply
                        </>
                      )}
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Please{" "}
                      <Link href={`/auth/login?redirect=/community/discussion/${params.id}`} className="text-primary">
                        sign in
                      </Link>{" "}
                      to post a reply
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {/* Author Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={author.avatar_url || "/placeholder.svg?height=80&width=80"} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <p className="text-sm text-muted-foreground">{author.role || "Member"}</p>
                <p className="text-xs text-muted-foreground mt-1">{author.joinDate}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/community/profile/${author.id}`}>View Profile</Link>
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="font-semibold">{discussion.author_posts || 0}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div>
                  <div className="font-semibold">{discussion.author_replies || 0}</div>
                  <div className="text-xs text-muted-foreground">Replies</div>
                </div>
                <div>
                  <div className="font-semibold">{discussion.author_likes || 0}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Discussions */}
          <Card>
            <CardHeader>
              <CardTitle>Related Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedDiscussions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No related discussions found</p>
              ) : (
                <div className="space-y-4">
                  {relatedDiscussions.map((related) => (
                    <div key={related.id}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={related.users?.avatar_url || "/placeholder.svg?height=40&width=40"}
                            alt={related.users?.name || "User"}
                          />
                          <AvatarFallback>{related.users?.name ? related.users.name.charAt(0) : "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/community/discussion/${related.id}`} className="font-medium hover:text-primary">
                            {related.title}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1">
                            {related.replies || 0} replies • {new Date(related.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {relatedDiscussions.indexOf(related) < relatedDiscussions.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DiscussionSkeleton() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-full max-w-md" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                  <Skeleton className="h-3 w-36 mt-1" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex items-center gap-6 mt-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Skeleton className="h-7 w-40" />

            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                      <div className="flex gap-4 mt-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32 mt-1" />
                <Skeleton className="h-3 w-48 mt-1" />
                <Skeleton className="h-10 w-32 mt-4" />
              </div>
              <Separator />
              <div className="grid grid-cols-3 text-center">
                <div>
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto mt-1" />
                </div>
                <div>
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto mt-1" />
                </div>
                <div>
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                  {i < 3 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

