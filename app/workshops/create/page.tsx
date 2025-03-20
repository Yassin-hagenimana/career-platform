"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { ArrowLeft, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

const workshopSchema = z.object({
  title: z.string().min(5, { message: "Workshop title must be at least 5 characters." }),
  description: z.string().min(100, { message: "Description must be at least 100 characters." }),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().min(1, { message: "Please enter a time." }),
  location: z.string().min(1, { message: "Please enter a location." }),
  location_type: z.enum(["virtual", "in-person", "hybrid"], {
    required_error: "Please select a location type.",
  }),
  is_virtual: z.boolean().default(false),
  price: z.string().min(1, { message: "Please enter a price (0 for free)." }),
  capacity: z.string().min(1, { message: "Please enter the capacity." }),
  category: z.string().min(1, { message: "Please select a category." }),
  image_url: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal("")),
  instructor_name: z.string().min(2, { message: "Instructor name must be at least 2 characters." }),
  instructor_bio: z.string().min(50, { message: "Instructor bio must be at least 50 characters." }),
  instructor_avatar: z.string().url({ message: "Please enter a valid avatar URL." }).optional().or(z.literal("")),
  prerequisites: z.array(z.string()).min(1, { message: "Please add at least 1 prerequisite." }),
  agenda: z
    .array(
      z.object({
        title: z.string().min(3, { message: "Agenda item title is required." }),
        description: z.string().min(10, { message: "Agenda item description is required." }),
        duration: z.string().optional(),
      }),
    )
    .min(1, { message: "Please add at least 1 agenda item." }),
})

type WorkshopFormData = z.infer<typeof workshopSchema>

export default function CreateWorkshopPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  const [formData, setFormData] = useState<WorkshopFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    location_type: "virtual" as const,
    is_virtual: false,
    price: "0",
    capacity: "20",
    category: "",
    image_url: "",
    instructor_name: "",
    instructor_bio: "",
    instructor_avatar: "",
    prerequisites: [""],
    agenda: [
      {
        title: "Introduction",
        description: "Overview of the workshop and introduction to the topic",
        duration: "30 minutes",
      },
    ],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    try {
      workshopSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join(".")] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePrerequisiteChange = (index: number, value: string) => {
    const newPrerequisites = [...formData.prerequisites]
    newPrerequisites[index] = value
    setFormData((prev) => ({
      ...prev,
      prerequisites: newPrerequisites,
    }))
  }

  const addPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""],
    }))
  }

  const removePrerequisite = (index: number) => {
    if (formData.prerequisites.length > 1) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: prev.prerequisites.filter((_, i) => i !== index),
      }))
    }
  }

  const handleAgendaChange = (index: number, field: string, value: string) => {
    const newAgenda = [...formData.agenda]
    newAgenda[index] = {
      ...newAgenda[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      agenda: newAgenda,
    }))
  }

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        {
          title: "",
          description: "",
          duration: "",
        },
      ],
    }))
  }

  const removeAgendaItem = (index: number) => {
    if (formData.agenda.length > 1) {
      setFormData((prev) => ({
        ...prev,
        agenda: prev.agenda.filter((_, i) => i !== index),
      }))
    }
  }

  // Update is_virtual when location_type changes
  const handleLocationTypeChange = (value: string) => {
    const isVirtual = value === "virtual" || value === "hybrid"
    setFormData((prev) => ({
      ...prev,
      location_type: value as "virtual" | "in-person" | "hybrid",
      is_virtual: isVirtual,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a workshop",
        variant: "destructive",
      })
      router.push("/auth/login?redirect=/workshops/create")
      return
    }

    const isValid = validateForm()
    if (!isValid) return

    setIsSubmitting(true)

    try {
      // Submit workshop to Supabase
      const { data, error } = await supabase
        .from("workshops")
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          location_type: formData.location_type,
          is_virtual: formData.is_virtual,
          price: Number.parseFloat(formData.price),
          capacity: Number.parseInt(formData.capacity),
          category: formData.category,
          image_url: formData.image_url || null,
          instructor_name: formData.instructor_name,
          host: formData.instructor_name,
          instructor_bio: formData.instructor_bio,
          instructor_avatar: formData.instructor_avatar || null,
          prerequisites: formData.prerequisites,
          agenda: formData.agenda,
          user_id: user.id,
          registered_count: 0,
        })
        .select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Your workshop has been created successfully.",
      })

      router.push(`/workshops/${data[0].id}`)
    } catch (error) {
      console.error("Error creating workshop:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create workshop",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/workshops">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workshops
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create a New Workshop</h1>
        <p className="text-muted-foreground mt-2">Fill out the form below to create a new workshop or event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details about your workshop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Workshop Title
              </label>
              <Input
                id="title"
                placeholder="e.g. Introduction to Web Development"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Workshop Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe what your workshop is about..."
                className="min-h-[150px]"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">
                  Time
                </label>
                <Input
                  id="time"
                  placeholder="e.g. 2:00 PM - 4:00 PM EST"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                />
                {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location_type" className="block text-sm font-medium mb-1">
                Location Type
              </label>
              <Select onValueChange={handleLocationTypeChange} value={formData.location_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.location_type && <p className="text-sm text-red-500 mt-1">{errors.location_type}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <Input
                id="location"
                placeholder={
                  formData.location_type === "virtual"
                    ? "e.g. Zoom (link will be sent after registration)"
                    : formData.location_type === "hybrid"
                      ? "e.g. 123 Main St, New York, NY and Zoom"
                      : "e.g. 123 Main St, New York, NY"
                }
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.location_type === "virtual"
                  ? "For virtual workshops, specify the platform (Zoom, Google Meet, etc.)"
                  : formData.location_type === "hybrid"
                    ? "For hybrid workshops, provide both the physical address and virtual platform"
                    : "For in-person workshops, provide the full address"}
              </p>
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price (USD)
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="e.g. 49.99 (0 for free)"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">Enter 0 for free workshops</p>
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium mb-1">
                  Capacity
                </label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g. 20"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">Maximum number of participants</p>
                {errors.capacity && <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Select onValueChange={(value) => handleInputChange("category", value)} value={formData.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Career Development">Career Development</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium mb-1">
                Workshop Image URL (Optional)
              </label>
              <Input
                id="image_url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter a URL to your workshop cover image</p>
              {errors.image_url && <p className="text-sm text-red-500 mt-1">{errors.image_url}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructor Information</CardTitle>
            <CardDescription>Provide details about the workshop instructor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="instructor_name" className="block text-sm font-medium mb-1">
                Instructor Name
              </label>
              <Input
                id="instructor_name"
                placeholder="e.g. John Smith"
                value={formData.instructor_name}
                onChange={(e) => handleInputChange("instructor_name", e.target.value)}
              />
              {errors.instructor_name && <p className="text-sm text-red-500 mt-1">{errors.instructor_name}</p>}
            </div>

            <div>
              <label htmlFor="instructor_bio" className="block text-sm font-medium mb-1">
                Instructor Bio
              </label>
              <Textarea
                id="instructor_bio"
                placeholder="Brief bio of the instructor..."
                className="min-h-[100px]"
                value={formData.instructor_bio}
                onChange={(e) => handleInputChange("instructor_bio", e.target.value)}
              />
              {errors.instructor_bio && <p className="text-sm text-red-500 mt-1">{errors.instructor_bio}</p>}
            </div>

            <div>
              <label htmlFor="instructor_avatar" className="block text-sm font-medium mb-1">
                Instructor Avatar URL (Optional)
              </label>
              <Input
                id="instructor_avatar"
                placeholder="https://example.com/avatar.jpg"
                value={formData.instructor_avatar}
                onChange={(e) => handleInputChange("instructor_avatar", e.target.value)}
              />
              {errors.instructor_avatar && <p className="text-sm text-red-500 mt-1">{errors.instructor_avatar}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workshop Content</CardTitle>
            <CardDescription>Define the agenda and prerequisites for your workshop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Prerequisites</label>
              <p className="text-sm text-muted-foreground mb-3">
                List what participants need to know or prepare before attending
              </p>
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Prerequisite ${index + 1}`}
                      value={prerequisite}
                      onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                    />
                    {errors[`prerequisites.${index}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`prerequisites.${index}`]}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePrerequisite(index)}
                    disabled={formData.prerequisites.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPrerequisite} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Prerequisite
              </Button>
              {errors.prerequisites && <p className="text-sm text-red-500 mt-1">{errors.prerequisites}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Workshop Agenda</label>
              <p className="text-sm text-muted-foreground mb-3">Outline what will be covered during the workshop</p>
              {formData.agenda.map((item, index) => (
                <Card key={index} className="border-dashed mb-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-2">
                        <label htmlFor={`agenda-title-${index}`} className="block text-sm font-medium mb-1">
                          Item {index + 1} Title
                        </label>
                        <Input
                          id={`agenda-title-${index}`}
                          placeholder="e.g. Introduction"
                          value={item.title}
                          onChange={(e) => handleAgendaChange(index, "title", e.target.value)}
                        />
                        {errors[`agenda.${index}.title`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`agenda.${index}.title`]}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAgendaItem(index)}
                        disabled={formData.agenda.length <= 1}
                        className="mt-6"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label htmlFor={`agenda-description-${index}`} className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        id={`agenda-description-${index}`}
                        placeholder="Describe what will be covered in this section..."
                        className="min-h-[80px]"
                        value={item.description}
                        onChange={(e) => handleAgendaChange(index, "description", e.target.value)}
                      />
                      {errors[`agenda.${index}.description`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`agenda.${index}.description`]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`agenda-duration-${index}`} className="block text-sm font-medium mb-1">
                        Duration
                      </label>
                      <Input
                        id={`agenda-duration-${index}`}
                        placeholder="e.g. 30 minutes"
                        value={item.duration}
                        onChange={(e) => handleAgendaChange(index, "duration", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAgendaItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Agenda Item
              </Button>
              {errors.agenda && <p className="text-sm text-red-500 mt-1">{errors.agenda}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Workshop..." : "Create Workshop"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

