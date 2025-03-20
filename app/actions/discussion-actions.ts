"use server"

import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createDiscussion(formData: FormData) {
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const content = formData.get("content") as string
  const authorId = formData.get("authorId") as string

  if (!title || !category || !content || !authorId) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Insert the discussion
    const { data: discussion, error: discussionError } = await supabase
      .from("discussions")
      .insert({
        title,
        category,
        author_id: authorId,
        replies: 0,
        views: 0,
        likes: 0,
        last_activity: new Date().toISOString(),
        isPopular: false,
      })
      .select()
      .single()

    if (discussionError) throw discussionError

    // Insert the discussion content
    const { error: contentError } = await supabase.from("discussion_contents").insert({
      discussion_id: discussion.id,
      content,
      author_id: authorId,
    })

    if (contentError) throw contentError

    // Revalidate the community page
    revalidatePath("/community")
    revalidatePath("/dashboard/community")

    // Return success
    return { success: true, discussionId: discussion.id }
  } catch (error: any) {
    console.error("Error creating discussion:", error)
    return { error: error.message || "Failed to create discussion" }
  }
}

export async function addComment(discussionId: string, userId: string, content: string) {
  if (!discussionId || !userId || !content) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Insert the comment
    const { data: comment, error: commentError } = await supabase
      .from("discussion_comments")
      .insert({
        discussion_id: discussionId,
        user_id: userId,
        content,
        likes: 0,
      })
      .select()
      .single()

    if (commentError) throw commentError

    // Increment reply count
    await supabase.rpc("increment_discussion_replies", { discussion_id: discussionId })

    // Revalidate the discussion page
    revalidatePath(`/community/discussion/${discussionId}`)

    return { success: true, comment }
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return { error: error.message || "Failed to add comment" }
  }
}

export async function likeDiscussion(discussionId: string, userId: string) {
  if (!discussionId || !userId) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Check if user already liked this discussion
    const { data: existingLike } = await supabase
      .from("discussion_likes")
      .select("id")
      .eq("discussion_id", discussionId)
      .eq("user_id", userId)
      .maybeSingle()

    if (existingLike) {
      // Unlike
      await supabase.from("discussion_likes").delete().eq("id", existingLike.id)
      await supabase.rpc("decrement_discussion_likes", { discussion_id: discussionId })
      return { success: true, action: "unliked" }
    } else {
      // Like
      await supabase.from("discussion_likes").insert({
        discussion_id: discussionId,
        user_id: userId,
      })
      await supabase.rpc("increment_discussion_likes", { discussion_id: discussionId })
      return { success: true, action: "liked" }
    }
  } catch (error: any) {
    console.error("Error liking discussion:", error)
    return { error: error.message || "Failed to process like" }
  }
}

