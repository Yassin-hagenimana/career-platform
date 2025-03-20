import { createClientServer } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const featured = searchParams.get("featured")

    const supabase = createClientServer()

    let query = supabase.from("jobs").select("*")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ jobs: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ jobs: [] })
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json()
    const supabase = createClientServer()

    const { data, error } = await supabase.from("jobs").insert(jobData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ job: data[0] })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

