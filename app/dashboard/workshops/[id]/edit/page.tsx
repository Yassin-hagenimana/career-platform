"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateWorkshop } from "@/app/actions/workshop-actions"
import { Loader2 } from "lucide-react"

export default function EditWorkshopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workshop, setWorkshop] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    isVirtual: false,
    price: "0",
    capacity: "20",
    category: "Technology",
    imageUrl: "",
    instructorName: "",
  })

  // Fetch workshop data and user session
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login?redirect=/dashboard/workshops")
        return
      }
      setUser(session.user)

      // Get workshop data
      const { data: workshop, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", session.user.id)
        .single()

      if (error || !workshop) {
        toast({
          title: "Error",
          description: "Workshop not found or you don't have permission to edit it",
          variant: "destructive",
        })
        router.push("/dashboard/workshops")
        return
      }

      // Format date for input field (YYYY-MM-DD)
      const formattedDate = new Date(workshop.date).toISOString().split("T")[0]

      setWorkshop(workshop)
      setFormData({
        title: workshop.title,
        description: workshop.description,
        date: formattedDate,
        time: workshop.time,
        location: workshop.location,
        isVirtual: workshop.is_virtual,
        price: workshop.price.toString(),
        capacity: workshop.capacity.toString(),
        category: workshop.category,
        imageUrl: workshop.image_url || "",
        instructorName: workshop.instructor_name,
      })

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, router, supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVirtual: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a workshop",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const form = new FormData()
    form.append("workshopId", params.id)
    form.append("title", formData.title)
    form.append("description", formData.description)
    form.append("date", formData.date)
    form.append("time", formData.time)
    form.append("location", formData.location)
    form.append("isVirtual", formData.isVirtual.toString())
    form.append("price", formData.price)
    form.append("capacity", formData.capacity)
    form.append("category", formData.category)
    form.append("imageUrl", formData.imageUrl)
    form.append("userId", user.id)
    form.append("instructorName", formData.instructorName)

    const result = await updateWorkshop(form)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    toast({
      title: "Success",
      description: "Workshop updated successfully",
    })

    router.push("/dashboard/workshops")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Workshop</h1>
        <p className="text-muted-foreground">Update your workshop details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Workshop Information</CardTitle>
            <CardDescription>
              Provide the details about your workshop. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Career Development">Career Development</SelectItem>
                    <SelectItem value="Personal Development">Personal Development</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isVirtual" checked={formData.isVirtual} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isVirtual">This is a virtual workshop</Label>
            </div>

            {!formData.isVirtual && (
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required={!formData.isVirtual}
                  placeholder="e.g., 123 Main St, City, State"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0 for free"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructorName">Instructor Name *</Label>
              <Input
                id="instructorName"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/workshops")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Workshop"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

