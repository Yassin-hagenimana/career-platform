"use client"

import Link from "next/link"
import { Calendar, Edit, Eye, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteWorkshopButton } from "./delete-workshop-button"

interface WorkshopCardProps {
  workshop: any
  userId?: string
  isCreator?: boolean
  isRegistration?: boolean
  isPast?: boolean
}

export function WorkshopCard({
  workshop,
  userId,
  isCreator = false,
  isRegistration = false,
  isPast = false,
}: WorkshopCardProps) {
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
          {isCreator && !isPast && userId && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/workshops/${workshop.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <DeleteWorkshopButton workshopId={workshop.id} userId={userId} workshopTitle={workshop.title} />
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
