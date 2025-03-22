import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkshopCard } from "./workshop-card"

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
                  <WorkshopCard key={workshop.id} workshop={workshop} userId={userId} isCreator={true} />
                ))}
              </div>
            )}
          </div>

          {pastWorkshops.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Past Workshops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastWorkshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} userId={userId} isCreator={true} isPast={true} />
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