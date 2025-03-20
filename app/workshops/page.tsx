import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Calendar, Clock, Filter, MapPin, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

async function getWorkshops() {
  const supabase = createServerComponentClient({ cookies })

  try {
    // First check if the location column exists
    const { data: columns, error: columnsError } = await supabase.from("workshops").select("*").limit(1)

    if (columnsError) throw columnsError

    // If location doesn't exist in the first row, use a simpler query
    const hasLocationColumn = columns && columns.length > 0 && "location" in columns[0]

    const query = supabase
      .from("workshops")
      .select(`
        id,
        title,
        description,
        date,
        time,
        ${hasLocationColumn ? "location," : ""}
        is_virtual,
        price,
        capacity,
        registered_count,
        instructor_name,
        image_url,
        category,
        created_at
      `)
      .order("date", { ascending: true })
      .gte("date", new Date().toISOString().split("T")[0])

    const { data: workshops, error } = await query

    if (error) throw error

    return workshops || []
  } catch (error) {
    console.error("Error fetching workshops:", error)
    return []
  }
}

export default async function WorkshopsPage() {
  const workshops = await getWorkshops()

  // Group workshops by type
  const upcomingWorkshops = workshops.slice(0, 6)
  const virtualWorkshops = workshops.filter((workshop) => workshop.is_virtual).slice(0, 6)
  const inPersonWorkshops = workshops.filter((workshop) => !workshop.is_virtual).slice(0, 6)

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workshops & Events</h1>
          <p className="text-muted-foreground mt-1">Join our interactive workshops and networking events</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search workshops..." className="w-full md:w-[300px] pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="virtual">Virtual</TabsTrigger>
          <TabsTrigger value="in-person">In-Person</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="virtual" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="in-person" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inPersonWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkshopCard({ workshop }) {
  // Format date
  const formattedDate = new Date(workshop.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={workshop.image_url || "/placeholder.svg?height=225&width=400"}
          alt={workshop.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant={workshop.is_virtual ? "secondary" : "outline"}>
            {workshop.is_virtual ? "Virtual" : "In-Person"}
          </Badge>
          <Badge variant="outline">{workshop.category}</Badge>
        </div>
        <Link href={`/workshops/${workshop.id}`} className="hover:underline">
          <h3 className="text-lg font-bold line-clamp-2 mt-2">{workshop.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{workshop.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{workshop.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{workshop.is_virtual ? "Online" : workshop.location || "TBD"}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {workshop.registered_count || 0} / {workshop.capacity} registered
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="font-bold">{workshop.price > 0 ? `$${workshop.price}` : "Free"}</div>
        <Button asChild>
          <Link href={`/workshops/${workshop.id}`}>Register Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

