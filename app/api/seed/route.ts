import { createClientServer } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClientServer()

    // Check if jobs table exists by trying to query it
    const { error: tableCheckError } = await supabase.from("jobs").select("*", { count: "exact", head: true })

    // If we get an error about the table not existing, we need to create it
    // But we'll do this through the SQL Editor instead of programmatically
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "Database tables do not exist. Please run the SQL setup script in the Supabase SQL Editor.",
          details: "See the documentation for the complete SQL setup script.",
        },
        { status: 400 },
      )
    }

    // If there was a different error, return it
    if (tableCheckError) {
      console.error("Error checking jobs table:", tableCheckError)
      return NextResponse.json({ error: tableCheckError.message }, { status: 500 })
    }

    // Check if jobs table has data
    const { count, error: countError } = await supabase.from("jobs").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking jobs count:", countError)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // If we already have data, don't seed
    if (count && count > 0) {
      return NextResponse.json({ message: "Database already has data" })
    }

    // Sample jobs data
    const jobsData = [
      {
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Nairobi, Kenya",
        type: "Full-time",
        category: "Technology",
        salary: "$60,000 - $80,000",
        description: "We are looking for a skilled Frontend Developer to join our team...",
        featured: true,
      },
      {
        title: "Marketing Manager",
        company: "GrowthCo",
        location: "Lagos, Nigeria",
        type: "Full-time",
        category: "Marketing",
        salary: "$50,000 - $70,000",
        description: "Lead our marketing efforts across Africa...",
        featured: false,
      },
      {
        title: "Financial Analyst",
        company: "AfriFinance",
        location: "Cape Town, South Africa",
        type: "Contract",
        category: "Finance",
        salary: "$40,000 - $60,000",
        description: "Analyze financial data and prepare reports...",
        featured: false,
      },
      {
        title: "UX Designer",
        company: "DesignHub",
        location: "Remote",
        type: "Part-time",
        category: "Design",
        salary: "$30 - $50 per hour",
        description: "Create user-centered designs for our products...",
        featured: true,
      },
      {
        title: "Project Manager",
        company: "BuildAfrica",
        location: "Accra, Ghana",
        type: "Full-time",
        category: "Management",
        salary: "$70,000 - $90,000",
        description: "Oversee construction projects across West Africa...",
        featured: false,
      },
    ]

    // Insert jobs data
    const { error: insertError } = await supabase.from("jobs").insert(jobsData)

    if (insertError) {
      console.error("Error seeding jobs table:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error in seed route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    )
  }
}

