"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function enrollInCourse(courseId: string) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to enroll" }
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .single()

  if (existingEnrollment) {
    return { success: false, message: "You are already enrolled in this course" }
  }

  // Create enrollment
  const { error } = await supabase.from("course_enrollments").insert({
    course_id: courseId,
    user_id: user.id,
    status: "active",
    enrolled_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error enrolling in course:", error)
    return { success: false, message: "Failed to enroll in course" }
  }

  // Revalidate the course page to show updated enrollment status
  revalidatePath(`/courses/${courseId}`)

  return { success: true, message: "Successfully enrolled in course" }
}

