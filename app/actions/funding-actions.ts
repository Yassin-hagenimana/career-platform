"use server"

import { createClientServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createFundingApplication(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const organization = formData.get("organization") as string
  const fundingType = formData.get("funding_type") as string
  const amount = formData.get("amount") as string
  const purpose = formData.get("purpose") as string
  const timeline = formData.get("timeline") as string
  const background = formData.get("background") as string
  const impact = formData.get("impact") as string
  const userId = formData.get("userId") as string

  if (!name || !email || !organization || !fundingType || !amount || !purpose || !timeline || !background || !impact) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Create funding_applications table if it doesn't exist
    await supabase.rpc("create_funding_applications_table_if_not_exists")

    // Submit application to Supabase
    const { data, error } = await supabase
      .from("funding_applications")
      .insert({
        name,
        email,
        organization,
        funding_type: fundingType,
        amount: Number.parseFloat(amount),
        purpose,
        timeline,
        background,
        impact,
        user_id: userId || null,
        status: "Pending",
      })
      .select()

    if (error) throw error

    revalidatePath("/dashboard/funding")
    revalidatePath("/funding")

    return { success: true, applicationId: data[0].id }
  } catch (error: any) {
    console.error("Error submitting application:", error)
    return { error: error.message || "Failed to submit application" }
  }
}

export async function updateFundingApplicationStatus(applicationId: string, status: string, feedback = "") {
  if (!applicationId || !status) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    const { error } = await supabase
      .from("funding_applications")
      .update({
        status,
        feedback,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (error) throw error

    revalidatePath("/dashboard/funding")
    revalidatePath(`/dashboard/funding/${applicationId}`)

    return { success: true }
  } catch (error: any) {
    console.error("Error updating funding application:", error)
    return { error: error.message || "Failed to update application" }
  }
}

export async function createFundingOpportunity(formData: FormData) {
  const title = formData.get("title") as string
  const provider = formData.get("provider") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const eligibility = formData.get("eligibility") as string
  const amount = formData.get("amount") as string
  const deadline = formData.get("deadline") as string
  const applicationProcess = formData.get("applicationProcess") as string
  const userId = formData.get("userId") as string

  if (!title || !provider || !category || !description || !eligibility || !amount || !deadline) {
    return { error: "Missing required fields" }
  }

  const supabase = createClientServer()

  try {
    // Create funding_opportunities table if it doesn't exist
    await supabase.rpc("create_funding_opportunities_table_if_not_exists")

    // Submit opportunity to Supabase
    const { data, error } = await supabase
      .from("funding_opportunities")
      .insert({
        title,
        provider,
        category,
        description,
        eligibility,
        amount,
        deadline,
        application_process: applicationProcess,
        user_id: userId,
        applicants: 0,
        featured: false,
      })
      .select()

    if (error) throw error

    revalidatePath("/dashboard/funding")
    revalidatePath("/funding")

    return { success: true, opportunityId: data[0].id }
  } catch (error: any) {
    console.error("Error creating funding opportunity:", error)
    return { error: error.message || "Failed to create opportunity" }
  }
}

