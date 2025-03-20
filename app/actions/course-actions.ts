"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const level = formData.get("level") as string
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string
  const userId = formData.get("userId") as string
  const instructorName = formData.get("instructorName") as string

  if (!title || !description || !level || !category || !userId || !instructorName) {
    return { error: "Missing required fields" }
  }

  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        price: Number(price || 0),
        level,
        category,
        image_url: imageUrl || null,
        user_id: userId,
        instructor_name: instructorName,
        students_count: 0,
        rating: null,
      })
      .select()

    if (error) throw error

    revalidatePath("/dashboard/courses")
    revalidatePath("/courses")

    return { success: true, courseId: data[0].id }
  } catch (error: any) {
    console.error("Error creating course:", error)
    return { error: error.message || "Failed to create course" }
  }
}

export async function enrollInCourse(formData: FormData) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to enroll in a course" }
    }

    const courseId = formData.get("courseId") as string
    const userId = formData.get("userId") as string
    const paymentMethod = formData.get("paymentMethod") as string

    // Verify the course exists
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", courseId)
      .single()

    if (courseError || !course) {
      console.error("Course not found:", courseError)
      return { error: "Course not found" }
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .single()

    if (existingEnrollment) {
      return { error: "You are already enrolled in this course" }
    }

    // Create enrollment record
    const { error: enrollmentError } = await supabase.from("course_enrollments").insert({
      course_id: courseId,
      user_id: userId,
      payment_method: paymentMethod,
      status: "active",
      enrolled_at: new Date().toISOString(),
    })

    if (enrollmentError) {
      console.error("Error creating enrollment:", enrollmentError)
      return { error: "Failed to complete enrollment" }
    }

    // Revalidate the course page and dashboard
    revalidatePath(`/courses/${courseId}`)
    revalidatePath("/dashboard/courses")

    return { success: true }
  } catch (error) {
    console.error("Error in enrollInCourse:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Add other course-related actions here

export async function updateCourse(formData: FormData) {
  // Implementation for updating a course
  return { success: true }
}

export async function deleteCourse(formData: FormData) {
  // Implementation for deleting a course
  return { success: true }
}

