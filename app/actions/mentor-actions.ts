"use server"

import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createMentorshipRequest(formData: FormData) {
  const mentorId = formData.get("mentorId") as string
  const menteeId = formData.get("menteeId") as string
  const goals = formData.get("goals") as string
  const experience = formData.get("experience") as string
  const frequency = formData.get("frequency") as string
  const duration = formData.get("duration") as string

  if (!mentorId || !menteeId || !goals || !experience || !frequency || !duration) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Check if user has already requested mentorship from this mentor
    const { data: existingRequest, error: checkError } = await supabase
      .from("mentorship_requests")
      .select("id, status")
      .eq("mentor_id", mentorId)
      .eq("mentee_id", menteeId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return { error: "You already have a pending request with this mentor" }
      } else if (existingRequest.status === "accepted") {
        return { error: "You are already connected with this mentor" }
      }
    }

    // Submit request to Supabase
    const { data, error } = await supabase
      .from("mentorship_requests")
      .insert({
        mentor_id: mentorId,
        mentee_id: menteeId,
        goals,
        experience,
        frequency,
        duration,
        status: "pending",
      })
      .select()

    if (error) throw error

    revalidatePath("/dashboard/mentors")
    revalidatePath(`/mentors/${mentorId}`)

    return { success: true, requestId: data[0].id }
  } catch (error: any) {
    console.error("Error creating mentorship request:", error)
    return { error: error.message || "Failed to submit request" }
  }
}

export async function updateMentorshipRequestStatus(requestId: string, status: "accepted" | "rejected", message = "") {
  if (!requestId || !status) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    const { error } = await supabase
      .from("mentorship_requests")
      .update({
        status,
        response_message: message,
        responded_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    if (error) throw error

    revalidatePath("/dashboard/mentors")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating mentorship request:", error)
    return { error: error.message || "Failed to update request" }
  }
}

