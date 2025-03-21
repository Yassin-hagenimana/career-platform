"use server"

import { createClientServer } from "@/lib/supabase"

type RegisterUserParams = {
  email: string
  password: string
  name: string
  phoneNumber: string
  userType: string
  country: string
}

export async function registerUser(params: RegisterUserParams) {
  try {
    const { email, password, name, phoneNumber, userType, country } = params

    // Validate required fields
    if (!email || !password || !name) {
      return {
        success: false,
        error: "Missing required fields: email, password, and name are required",
      }
    }

    console.log("Registration attempt:", { email, name, userType, country })

    const supabase = createClientServer()

    // First, check if the user already exists
    const { data: existingUser } = await supabase.from("profiles").select("id, email").eq("email", email).maybeSingle()

    if (existingUser) {
      console.log("User with this email already exists:", email)
      return {
        success: false,
        error: "An account with this email already exists. Please use a different email or try logging in.",
      }
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          user_type: userType,
        },
      },
    })

    if (authError) {
      console.error("Auth signup error:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData?.user?.id) {
      console.error("No user ID returned from auth signup")
      return { success: false, error: "Failed to create user account" }
    }

    const userId = authData.user.id
    const timestamp = new Date().toISOString()

    console.log("Auth user created successfully:", userId)

    try {
      // Before inserting, check if a profile already exists for this user ID
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

      if (!existingProfile) {
        // Only insert if profile doesn't exist
        const { error: profileError } = await supabase.from("profiles").insert({
          id: userId,
          name: name,
          email: email,
          phone_number: phoneNumber || null,
          country: country || null,
          user_type: userType || "jobseeker",
          created_at: timestamp,
          updated_at: timestamp,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          console.warn("Profile creation failed, but auth user was created")
        } else {
          console.log("Profile created successfully")
        }
      } else {
        console.log("Profile already exists for user, skipping profile creation")
      }

      // Check if user exists in users table
      const { data: existingUserRecord } = await supabase.from("users").select("id").eq("id", userId).maybeSingle()

      if (!existingUserRecord) {
        // Only insert if user doesn't exist in users table
        const { error: userError } = await supabase.from("users").insert({
          id: userId,
          name: name,
          email: email,
          phone_number: phoneNumber || null,
          country: country || null,
          user_type: userType || "jobseeker",
          created_at: timestamp,
        })

        if (userError) {
          console.error("Users table insertion error:", userError)
          console.warn("Users table insertion failed, but auth user was created")
        } else {
          console.log("User record created successfully in users table")
        }
      } else {
        console.log("User already exists in users table, skipping insertion")
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue anyway since the auth user was created
      console.warn("Database operations failed, but auth user was created")
    }

    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

