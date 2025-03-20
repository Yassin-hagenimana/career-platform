import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Calendar, Edit, Eye, MapPin, Plus, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// In the getUserWorkshops function, add error handling for table not existing
async function getUserWorkshops(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create workshops table if it doesn't exist
    await supabase.rpc("create_workshops_table_if_not_exists")

    const { data: workshops, error } = await supabase
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
        category,
        image_url,
        created_at
      `)
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching workshops:", error)
      return []
    }

    return workshops || []
  } catch (error) {
    console.error("Error in getUserWorkshops:", error)
    return []
  }
}

// In the getUserRegistrations function, add error handling for table not existing
async function getUserRegistrations(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create workshop_registrations table if it doesn't exist
    await supabase.rpc("create_workshop_registrations_table_if_not_exists")

    const { data: registrations, error } = await supabase
      .from("workshop_registrations")
      .select(`
        id,
        created_at,
        workshop:workshop_id (
          id,
          title,
          description,
          date,
          time,
          location,
          is_virtual,
          price,
          category,
          image_url,
          instructor_name
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching registrations:", error)
      return []
    }

    // Format the data to match the expected structure
    const formattedRegistrations = registrations.map((registration) => ({
      id: registration.id,
      created_at: registration.created_at,
      workshops: registration.workshop,
    }))

    return formattedRegistrations || []
  } catch (error) {
    console.error("Error in getUserRegistrations:", error)
    return []
  }
}

export default async function DashboardWorkshopsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?redirect=/dashboard/workshops")
  }

  const userId = session.user.id
  const workshops = await getUserWorkshops(userId)
  const registrations = await getUserRegistrations(userId)

  // Filter workshops into upcoming and past
  const now = new Date()
  const upcomingWorkshops = workshops.filter((workshop) => new Date(workshop.date) >= now)
  const pastWorkshops = workshops.filter((workshop) => new Date(workshop.date) < now)

  // Filter registrations into upcoming and past
  const upcomingRegistrations = registrations.filter((reg) => new Date(reg.workshops.date) >= now)
  const pastRegistrations = registrations.filter((reg) => new Date(reg.workshops.date) < now)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workshops</h2>
          <p className="text-muted-foreground">Manage your workshops and event registrations</p>
        </div>
        <Button asChild>
          <Link href="/workshops/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Workshop
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-workshops" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-workshops">My Workshops</TabsTrigger>
          <TabsTrigger value="registered">Registered Workshops</TabsTrigger>
        </TabsList>
        <TabsContent value="my-workshops" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming Workshops</h3>
            {upcomingWorkshops.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No upcoming workshops</CardTitle>
                  <CardDescription>
                    You don't have any upcoming workshops. Create a new workshop to get started.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href="/workshops/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workshop
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} isCreator={true} />
                ))}
              </div>
            )}
          </div>

          {pastWorkshops.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Past Workshops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} isCreator={true} isPast={true} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="registered" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming Registrations</h3>
            {upcomingRegistrations.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No upcoming registrations</CardTitle>
                  <CardDescription>
                    You haven't registered for any upcoming workshops. Browse our workshops to find events that interest
                    you.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href="/workshops">Browse Workshops</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingRegistrations.map((registration) => (
                  <WorkshopCard key={registration.id} workshop={registration.workshops} isRegistration={true} />
                ))}
              </div>
            )}
          </div>

          {pastRegistrations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Past Registrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastRegistrations.map((registration) => (
                  <WorkshopCard
                    key={registration.id}
                    workshop={registration.workshops}
                    isRegistration={true}
                    isPast={true}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkshopCard({ workshop, isCreator = false, isRegistration = false, isPast = false }) {
  // Format date
  const formattedDate = new Date(workshop.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={workshop.image_url || "/placeholder.svg?height=225&width=400"}
          alt={workshop.title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant={workshop.is_virtual ? "secondary" : "outline"}>
            {workshop.is_virtual ? "Virtual" : "In-Person"}
          </Badge>
          <Badge variant="outline">{workshop.category}</Badge>
        </div>
        <CardTitle className="text-lg mt-2">{workshop.title}</CardTitle>
        <CardDescription className="line-clamp-2">{workshop.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {formattedDate} • {workshop.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{workshop.is_virtual ? "Online" : workshop.location}</span>
        </div>
        {isCreator && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {workshop.registered_count || 0} / {workshop.capacity} registered
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="font-bold">{workshop.price > 0 ? `$${workshop.price}` : "Free"}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workshops/${workshop.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          {isCreator && !isPast && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/workshops/${workshop.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
          {isRegistration && !isPast && (
            <Button variant="outline" size="sm" className="text-destructive">
              Cancel
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

