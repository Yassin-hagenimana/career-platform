import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Mentors | Career Platform",
  description: "Find a mentor to help guide your career journey",
}

async function getMentors() {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Fetch all mentors with user data - temporarily remove is_approved filter to see if any mentors exist
    const { data: mentors, error } = await supabase.from("mentors").select(`
    id,
    user_id,
    expertise,
    experience_years,
    bio,
    hourly_rate,
    availability,
    created_at,
    profession,
    company,
    is_approved,
    profiles:user_id (
      id,
      name,
      avatar_url,
      email,
      country
    )
  `)
 
    if (error) {
      console.error("Error fetching mentors:", error)
      return []
    }

    const approvedMentors = mentors?.filter((mentor) => mentor.is_approved === true) || []
    return mentors || []
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return []
  }
}

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: { query?: string; expertise?: string }
}) {
  // Get search parameters
  const query = searchParams.query || ""
  const expertise = searchParams.expertise || ""

  // Fetch mentors
  const mentors = await getMentors()

  // Filter mentors based on search parameters
  const filteredMentors = mentors.filter((mentor) => {
    const mentorName = mentor.profiles?.name || ""
    const mentorProfession = mentor.profession || ""
    const mentorCompany = mentor.company || ""

    const matchesQuery =
      !query ||
      mentorName.toLowerCase().includes(query.toLowerCase()) ||
      mentorProfession.toLowerCase().includes(query.toLowerCase()) ||
      mentorCompany.toLowerCase().includes(query.toLowerCase())

    // Handle expertise as either an array or a string
    let expertiseArray: string[] = []
    if (mentor.expertise) {
      if (Array.isArray(mentor.expertise)) {
        expertiseArray = mentor.expertise
      } else if (typeof mentor.expertise === "string") {
        try {
          // Try parsing as JSON if it's a stringified array
          const parsedExpertise = JSON.parse(mentor.expertise)
          expertiseArray = Array.isArray(parsedExpertise)
            ? parsedExpertise
            : mentor.expertise.split(",").map((skill) => skill.trim())
        } catch (e) {
          // If parsing fails, split by comma
          expertiseArray = mentor.expertise.split(",").map((skill) => skill.trim())
        }
      }
    }

    const matchesExpertise =
      !expertise || expertiseArray.some((skill) => skill.toLowerCase() === expertise.toLowerCase())

    // For debugging, temporarily ignore the is_approved filter
    // return matchesQuery && matchesExpertise && mentor.is_approved === true
    return matchesQuery && matchesExpertise
  })

  // Get unique expertise areas for filtering
  const allExpertiseAreas: string[] = []
  mentors.forEach((mentor) => {
    if (mentor.expertise) {
      let expertiseArray: string[] = []
      if (Array.isArray(mentor.expertise)) {
        expertiseArray = mentor.expertise
      } else if (typeof mentor.expertise === "string") {
        try {
          // Try parsing as JSON if it's a stringified array
          const parsedExpertise = JSON.parse(mentor.expertise)
          expertiseArray = Array.isArray(parsedExpertise)
            ? parsedExpertise
            : mentor.expertise.split(",").map((skill) => skill.trim())
        } catch (e) {
          // If parsing fails, split by comma
          expertiseArray = mentor.expertise.split(",").map((skill) => skill.trim())
        }
      }

      expertiseArray.forEach((skill) => {
        if (!allExpertiseAreas.includes(skill)) {
          allExpertiseAreas.push(skill)
        }
      })
    }
  })

  const uniqueExpertiseAreas = allExpertiseAreas.map((area) => ({ name: area }))

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
          <p className="text-muted-foreground mt-2">
            Connect with industry professionals who can guide your career journey
          </p>
        </div>
        <Button asChild>
          <Link href="/mentors/apply">Become a Mentor</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] mb-10">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Search</h3>
            <form action="/mentors" method="get">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="query"
                  placeholder="Search mentors..."
                  className="pl-8"
                  defaultValue={query}
                />
              </div>
            </form>
          </div>

          <div>
            <h3 className="font-medium mb-2">Filter by Expertise</h3>
            <div className="space-y-2">
              <Link
                href="/mentors"
                className={`block px-3 py-2 text-sm rounded-md ${!expertise ? "bg-muted font-medium" : "hover:bg-muted/50"}`}
              >
                All Expertise Areas
              </Link>
              {uniqueExpertiseAreas.map((area: any) => (
                <Link
                  key={area.name}
                  href={`/mentors?expertise=${encodeURIComponent(area.name)}`}
                  className={`block px-3 py-2 text-sm rounded-md ${expertise === area.name ? "bg-muted font-medium" : "hover:bg-muted/50"}`}
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          {filteredMentors.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-6">
                {query || expertise ? "Try adjusting your search filters" : "Check back soon as we add more mentors"}
              </p>
              {(query || expertise) && (
                <Button variant="outline" asChild>
                  <Link href="/mentors">Clear Filters</Link>
                </Button>
              )}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => {
              // Handle expertise as either an array or a string
              let expertiseArray: string[] = []
              if (mentor.expertise) {
                if (Array.isArray(mentor.expertise)) {
                  expertiseArray = mentor.expertise
                } else if (typeof mentor.expertise === "string") {
                  try {
                    // Try parsing as JSON if it's a stringified array
                    const parsedExpertise = JSON.parse(mentor.expertise)
                    expertiseArray = Array.isArray(parsedExpertise)
                      ? parsedExpertise
                      : mentor.expertise.split(",").map((skill) => skill.trim())
                  } catch (e) {
                    // If parsing fails, split by comma
                    expertiseArray = mentor.expertise.split(",").map((skill) => skill.trim())
                  }
                }
              }

              return (
                <Card key={mentor.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                  </CardHeader>
                  <CardContent className="p-6 pt-0 -mt-12">
                    <div className="flex justify-center">
                      <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-white">
                        {mentor.profiles?.avatar_url ? (
                          <Image
                            src={mentor.profiles.avatar_url || "/placeholder.svg?height=96&width=96"}
                            alt={mentor.profiles.name || "Mentor"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                            {mentor.profiles?.name?.charAt(0) || "M"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <CardTitle className="text-xl">{mentor.profiles?.name || "Anonymous Mentor"}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {mentor.profession || mentor.profiles?.email} {mentor.company ? `at ${mentor.company}` : ""}
                      </CardDescription>
                      <CardDescription className="line-clamp-1 capitalize">
                     From {mentor.profiles?.country || ""}
                     </CardDescription>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1 justify-center">
                      {expertiseArray.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {expertiseArray.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{expertiseArray.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-center text-muted-foreground">
                      <p className="line-clamp-3">
                        {mentor.bio || "Experienced professional ready to help you grow in your career."}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/mentors/${mentor.id}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
