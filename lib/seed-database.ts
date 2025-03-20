import { createClientServer } from "./supabase"

export async function seedDatabase() {
  const supabase = createClientServer()

  // Check if jobs table exists and has data
  const { count, error: countError } = await supabase.from("jobs").select("*", { count: "exact", head: true })

  if (countError) {
    console.error("Error checking jobs table:", countError)
    return { success: false, error: countError.message }
  }

  // If we already have data, don't seed
  if (count && count > 0) {
    return { success: true, message: "Database already has data" }
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
    return { success: false, error: insertError.message }
  }

  return { success: true, message: "Database seeded successfully" }
}

