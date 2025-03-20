import { createClientServer } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const featured = searchParams.get("featured")

    const supabase = createClientServer()

    let query = supabase.from("courses").select("*")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (level && level !== "all") {
      query = query.eq("level", level)
    }

    if (featured === "true") {
      query = query.eq("isFeatured", true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ courses: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const courseData = await request.json()
    const supabase = createClientServer()

    const { data, error } = await supabase.from("courses").insert(courseData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ course: data[0] })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

