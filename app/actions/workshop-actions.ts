"use server"

import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createWorkshop(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const location = formData.get("location") as string
  const isVirtual = formData.get("isVirtual") === "true"
  const price = formData.get("price") as string
  const capacity = formData.get("capacity") as string
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string
  const userId = formData.get("userId") as string
  const instructorName = formData.get("instructorName") as string

  if (!title || !description || !date || !time || !category || !userId || !instructorName) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    const { data, error } = await supabase
      .from("workshops")
      .insert({
        title,
        description,
        date,
        time,
        location: location || (isVirtual ? "Online" : ""),
        is_virtual: isVirtual,
        price: Number(price || 0),
        capacity: Number(capacity || 20),
        registered_count: 0,
        category,
        image_url: imageUrl || null,
        user_id: userId,
        instructor_name: instructorName,
      })
      .select()

    if (error) throw error

    revalidatePath("/dashboard/workshops")
    revalidatePath("/workshops")

    return { success: true, workshopId: data[0].id }
  } catch (error: any) {
    console.error("Error creating workshop:", error)
    return { error: error.message || "Failed to create workshop" }
  }
}

export async function updateWorkshop(formData: FormData) {
  const workshopId = formData.get("workshopId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const location = formData.get("location") as string
  const isVirtual = formData.get("isVirtual") === "true"
  const price = formData.get("price") as string
  const capacity = formData.get("capacity") as string
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string
  const userId = formData.get("userId") as string
  const instructorName = formData.get("instructorName") as string

  if (!workshopId || !title || !description || !date || !time || !category || !userId || !instructorName) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // First check if the workshop belongs to the user
    const { data: workshop, error: checkError } = await supabase
      .from("workshops")
      .select("id")
      .eq("id", workshopId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (!workshop) {
      return { error: "Workshop not found or you don't have permission to edit it" }
    }

    // Update the workshop
    const { data, error } = await supabase
      .from("workshops")
      .update({
        title,
        description,
        date,
        time,
        location: location || (isVirtual ? "Online" : ""),
        is_virtual: isVirtual,
        price: Number(price || 0),
        capacity: Number(capacity || 20),
        category,
        image_url: imageUrl || null,
        instructor_name: instructorName,
      })
      .eq("id", workshopId)
      .select()

    if (error) throw error

    revalidatePath("/dashboard/workshops")
    revalidatePath(`/workshops/${workshopId}`)
    revalidatePath(`/dashboard/workshops/${workshopId}/edit`)

    return { success: true, workshopId: data[0].id }
  } catch (error: any) {
    console.error("Error updating workshop:", error)
    return { error: error.message || "Failed to update workshop" }
  }
}

export async function registerForWorkshop(formData: FormData) {
  const workshopId = formData.get("workshopId") as string
  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const organization = formData.get("organization") as string
  const attendanceMode = formData.get("attendanceMode") as string
  const dietaryRequirements = formData.get("dietaryRequirements") as string
  const specialRequests = formData.get("specialRequests") as string

  if (!workshopId || !userId || !name || !email || !phone || !attendanceMode) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Check if user is already registered
    const { data: existingReg, error: checkError } = await supabase
      .from("workshop_registrations")
      .select("id")
      .eq("workshop_id", workshopId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingReg) {
      return { error: "You are already registered for this workshop" }
    }

    // Register for the workshop
    const { data, error } = await supabase
      .from("workshop_registrations")
      .insert({
        workshop_id: workshopId,
        user_id: userId,
        name,
        email,
        phone,
        organization: organization || null,
        attendance_mode: attendanceMode,
        dietary_requirements: dietaryRequirements || null,
        special_requests: specialRequests || null,
        status: "confirmed",
      })
      .select()

    if (error) throw error

    // Increment the registered count
    await supabase.rpc("increment_workshop_registrations", { workshop_id: workshopId })

    revalidatePath("/dashboard/workshops")
    revalidatePath(`/workshops/${workshopId}`)

    return { success: true, registrationId: data[0].id }
  } catch (error: any) {
    console.error("Error registering for workshop:", error)
    return { error: error.message || "Failed to register for workshop" }
  }
}

export async function deleteWorkshop(formData: FormData) {
  const workshopId = formData.get("workshopId") as string
  const userId = formData.get("userId") as string

  if (!workshopId || !userId) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // First check if the workshop belongs to the user
    const { data: workshop, error: checkError } = await supabase
      .from("workshops")
      .select("id")
      .eq("id", workshopId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (!workshop) {
      return { error: "Workshop not found or you don't have permission to delete it" }
    }

    // Delete any registrations for this workshop
    const { error: regDeleteError } = await supabase
      .from("workshop_registrations")
      .delete()
      .eq("workshop_id", workshopId)

    if (regDeleteError) {
      console.error("Error deleting workshop registrations:", regDeleteError)
      // Continue with workshop deletion even if registrations deletion fails
    }

    // Delete the workshop
    const { error: deleteError } = await supabase.from("workshops").delete().eq("id", workshopId)

    if (deleteError) throw deleteError

    revalidatePath("/dashboard/workshops")
    revalidatePath("/workshops")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting workshop:", error)
    return { error: error.message || "Failed to delete workshop" }
  }
}

