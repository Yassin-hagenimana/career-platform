import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Users } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { WorkshopRegistrationDialog } from '@/app/workshops/workshop-registration-client'

async function getWorkshop(id: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data: workshop, error } = await supabase
    .from("workshops")
    .select(`
      id,
      title,
      description,
      date,
      time,
      location,
      is_virtual,
      price,
      capacity,
      registered_count,
      instructor_name,
      instructor_bio,
      instructor_avatar,
      image_url,
      category,
      agenda,
      prerequisites,
      created_at
    `)
    .eq("id", id)
    .single()

  if (error || !workshop) {
    console.error("Error fetching workshop:", error)
    return null
  }

  return workshop
}

export default async function WorkshopDetailPage({ params }: { params: { id: string } }) {
  const workshop = await getWorkshop(params.id)

  if (!workshop) {
    notFound()
  }

  // Format date
  const formattedDate = new Date(workshop.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Parse agenda as an array if it's a string
  const agenda = Array.isArray(workshop.agenda)
    ? workshop.agenda
    : typeof workshop.agenda === "string"
      ? JSON.parse(workshop.agenda)
      : []

  // Parse prerequisites as an array if it's a string
  const prerequisites = Array.isArray(workshop.prerequisites)
    ? workshop.prerequisites
    : typeof workshop.prerequisites === "string"
      ? workshop.prerequisites.split(",").map((item) => item.trim())
      : []

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/workshops">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workshops
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={workshop.is_virtual ? "secondary" : "outline"}>
                {workshop.is_virtual ? "Virtual" : "In-Person"}
              </Badge>
              <Badge variant="outline">{workshop.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
            <p className="text-muted-foreground">{workshop.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{workshop.is_virtual ? "Online" : workshop.location}</span>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage
                  src={workshop.instructor_avatar || "/placeholder.svg?height=40&width=40"}
                  alt={workshop.instructor_name}
                />
                <AvatarFallback>{workshop.instructor_name?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{workshop.instructor_name}</p>
                <p className="text-sm text-muted-foreground">Workshop Instructor</p>
              </div>
            </div>
          </div>

          <Card className="block lg:hidden">
            <CardContent className="p-4">
              <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                <img
                  src={workshop.image_url || "/placeholder.svg?height=225&width=400"}
                  alt={workshop.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-3xl font-bold mb-4">{workshop.price > 0 ? `$${workshop.price}` : "Free"}</div>
              <Suspense fallback={<Button className="w-full">Loading...</Button>}>
                <WorkshopRegistrationDialog
                  workshop={{
                    id: workshop.id,
                    title: workshop.title,
                    date: formattedDate,
                    time: workshop.time,
                    attendees: workshop.registered_count,
                  }}
                />
              </Suspense>
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {workshop.registered_count || 0} / {workshop.capacity} spots filled
                </span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About This Workshop</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>{workshop.description}</p>
              <p>
                Join us for this interactive workshop where you'll gain practical skills and knowledge that you can
                immediately apply to your career. This workshop is designed to be hands-on, collaborative, and focused
                on real-world applications.
              </p>
              <p>
                Whether you're just starting out or looking to enhance your existing skills, this workshop provides the
                guidance and practice you need to succeed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workshop Agenda</CardTitle>
              <CardDescription>What we'll cover during the session</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {agenda.map((item, index) => (
                  <li key={index} className="border-l-2 border-primary pl-4 py-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.duration && <p className="text-xs text-muted-foreground mt-1">Duration: {item.duration}</p>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>What you need to know or prepare before attending</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {prerequisites.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={workshop.instructor_avatar || "/placeholder.svg?height=64&width=64"}
                    alt={workshop.instructor_name}
                  />
                  <AvatarFallback>{workshop.instructor_name?.charAt(0) || "I"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{workshop.instructor_name}</h3>
                  <p className="text-sm text-muted-foreground">Workshop Instructor</p>
                </div>
              </div>
              <p className="text-sm">
                {workshop.instructor_bio ||
                  `${workshop.instructor_name} is an experienced professional with expertise in ${workshop.category}. They have a passion for teaching and sharing knowledge with others.`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                  <img
                    src={workshop.image_url || "/placeholder.svg?height=225&width=400"}
                    alt={workshop.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-3xl font-bold mb-4">{workshop.price > 0 ? `$${workshop.price}` : "Free"}</div>
                <Suspense fallback={<Button className="w-full">Loading...</Button>}>
                  <WorkshopRegistrationDialog
                    workshop={{
                      id: workshop.id,
                      title: workshop.title,
                      date: formattedDate,
                      time: workshop.time,
                      attendees: workshop.registered_count,
                    }}
                  />
                </Suspense>
                <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {workshop.registered_count || 0} / {workshop.capacity} spots filled
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Date and Time</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{workshop.time}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {workshop.is_virtual ? "Online (link will be sent after registration)" : workshop.location}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

