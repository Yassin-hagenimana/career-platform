"use server"

import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDiscussion(formData: FormData) {
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const content = formData.get("content") as string
  const authorId = formData.get("authorId") as string

  if (!title || !category || !content || !authorId) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

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

  if (discussionError) {
    return { error: discussionError.message }
  }

  // Insert the discussion content
  const { error: contentError } = await supabase.from("discussion_contents").insert({
    discussion_id: discussion.id,
    content,
    author_id: authorId,
  })

  if (contentError) {
    return { error: contentError.message }
  }

  // Revalidate the community page
  revalidatePath("/community")

  // Redirect to the new discussion
  redirect(`/community/discussion/${discussion.id}`)
}

