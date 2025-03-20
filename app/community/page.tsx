// Ensure this file has NO "use client"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import CommunityPageClient from "./CommunityPageClient" // Import client component

export default async function CommunityPage() {
  const supabase = createServerComponentClient({ cookies })

  try {
    await supabase.rpc("create_discussions_table_if_not_exists")
    await supabase.rpc("create_discussion_contents_table_if_not_exists")
    await supabase.rpc("create_discussion_comments_table_if_not_exists")

    const { data: discussions } = await supabase
      .from("discussions")
      .select(`id, title, category, views, likes, replies, created_at, last_activity, author:author_id (id, name, avatar_url)`)
      .order("last_activity", { ascending: false })
      .limit(10)

    const { data: popularDiscussions } = await supabase
      .from("discussions")
      .select(`id, title, category, views, likes, replies, created_at, author:author_id (id, name, avatar_url)`)
      .order("views", { ascending: false })
      .limit(5)

    const { data: activeUsers } = await supabase
      .from("users")
      .select(`id, name, avatar_url, role`)
      .limit(5)

    return (
      <CommunityPageClient
        discussions={discussions || []}
        popularDiscussions={popularDiscussions || []}
        activeUsers={activeUsers || []}
      />
    )
  } catch (error) {
    console.error("Error in CommunityPage:", error)
    return <CommunityPageClient discussions={[]} popularDiscussions={[]} activeUsers={[]} />
  }
}
