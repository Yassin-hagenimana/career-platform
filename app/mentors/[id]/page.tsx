import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, DollarSign, Mail, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RequestMentorshipButton } from "@/components/request-mentorship-button"

async function getMentor(id: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: mentor, error } = await supabase
      .from("mentors")
      .select(`
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
        profiles(
          id,
          full_name,
          avatar_url,
          title,
          location
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching mentor:", error)
      return null
    }

    console.log("Fetched mentor:", mentor)
    return mentor
  } catch (error) {
    console.error("Error fetching mentor:", error)
    return null
  }
}

export default async function MentorProfilePage({ params }: { params: { id: string } }) {
  const mentor = await getMentor(params.id)

  if (!mentor) {
    notFound()
  }

  // Extract expertise as an array
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
          : mentor.expertise.split(",").map((item) => item.trim())
      } catch (e) {
        // If parsing fails, split by comma
        expertiseArray = mentor.expertise.split(",").map((item) => item.trim())
      }
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/mentors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mentors
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={mentor.profiles?.avatar_url || "/placeholder.svg?height=96&width=96"}
                  alt={mentor.profiles?.full_name || "Mentor"}
                />
                <AvatarFallback>{mentor.profiles?.full_name?.charAt(0) || "M"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{mentor.profiles?.full_name}</h2>
              <p className="text-muted-foreground">{mentor.profession || mentor.profiles?.title}</p>

              {mentor.profiles?.location && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{mentor.profiles.location}</span>
                </div>
              )}

              <Separator className="my-4" />

              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Experience</span>
                  </div>
                  <span className="font-medium">{mentor.experience_years} years</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Hourly Rate</span>
                  </div>
                  <span className="font-medium">${mentor.hourly_rate}/hr</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Availability</span>
                  </div>
                  <span className="font-medium">{mentor.availability || "Flexible"}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <RequestMentorshipButton mentorId={mentor.id} userId={mentor.user_id} className="w-full" />

              <Button variant="outline" className="w-full mt-2">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{mentor.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expertise</CardTitle>
              <CardDescription>Areas of specialization and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expertiseArray.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {mentor.company && (
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
                <CardDescription>Current workplace</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{mentor.company}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Style</CardTitle>
              <CardDescription>How I approach mentoring</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                I believe in a collaborative approach to mentorship. I'll guide you through challenges, provide
                constructive feedback, and help you develop the skills you need to succeed in your career. My goal is to
                empower you to reach your full potential.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

