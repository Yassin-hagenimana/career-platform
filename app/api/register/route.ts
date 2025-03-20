import { createClientServer } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, name, phoneNumber, userType, country } = await request.json()
    const supabase = createClientServer()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      // Insert additional user data into the users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        phone_number: phoneNumber,
        user_type: userType,
        country,
      })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

