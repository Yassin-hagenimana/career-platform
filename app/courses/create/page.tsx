"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Define categories
const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
  "UI/UX Design",
  "Other",
]

// Define module type
type Module = {
  title: string
  description: string
}

export default function CreateCoursePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [courseUrl, setCourseUrl] = useState("")
  const [duration, setDuration] = useState("")
  const [instructor, setInstructor] = useState("")
  const [modules, setModules] = useState<Module[]>([{ title: "", description: "" }])

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a course",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    fetchUser()
  }, [supabase, router])

  // Function to add a new module
  const addModule = () => {
    setModules([...modules, { title: "", description: "" }])
  }

  // Function to remove a module
  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index))
    } else {
      toast({
        title: "Error",
        description: "You need at least one module",
        variant: "destructive",
      })
    }
  }

  // Function to update a module
  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...modules]
    updatedModules[index] = { ...updatedModules[index], [field]: value }
    setModules(updatedModules)
  }

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title || title.length < 3) {
      newErrors.title = "Course title must be at least 3 characters"
    }

    if (!description || description.length < 10) {
      newErrors.description = "Course description must be at least 10 characters"
    }

    if (!category) {
      newErrors.category = "Please select a category"
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL for the course image"
    }

    if (!courseUrl || !isValidUrl(courseUrl)) {
      newErrors.courseUrl = "Please enter a valid URL for the course"
    }

    if (!duration) {
      newErrors.duration = "Please enter the course duration"
    }

    if (!instructor) {
      newErrors.instructor = "Please enter the instructor name"
    }

    // Validate modules
    let hasModuleError = false
    modules.forEach((module, index) => {
      if (!module.title) {
        newErrors[`module_${index}_title`] = "Module title is required"
        hasModuleError = true
      }
    })

    if (modules.length === 0) {
      newErrors.modules = "At least one module is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if a string is a valid URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a course",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the course data
      const courseData = {
        title,
        description,
        category,
        image_url: imageUrl || null,
        course_url: courseUrl,
        duration,
        instructor,
        created_by: userId,
        // Add default values for any other required fields
        status: "published",
        price: 0,
      }

      console.log("Inserting course with data:", courseData)

      // Insert the course into the database
      const { data: course, error: courseError } = await supabase.from("courses").insert(courseData).select().single()

      if (courseError) {
        console.error("Course insertion error:", courseError)
        throw new Error(`Course insertion failed: ${courseError.message}`)
      }

      if (!course || !course.id) {
        throw new Error("Course was created but no valid ID was returned")
      }

      console.log("Course created successfully:", course)

      // Create a simplified approach for modules - create one by one
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i]

        // Create syllabus JSON structure
        const syllabusData = {
          content: module.description || "",
          resources: [],
          quizzes: [],
        }

        const moduleData = {
          course_id: course.id,
          title: module.title,
          description: module.description || null,
          order: i + 1,
          // Add the syllabus field as jsonb
          syllabus: syllabusData,
          // Add additional required fields with default values
          status: "published",
          created_by: userId,
        }

        console.log(`Inserting module ${i + 1}:`, moduleData)

        const { error: moduleError } = await supabase.from("course_modules").insert(moduleData)

        if (moduleError) {
          console.error(`Error inserting module ${i + 1}:`, moduleError)
          throw new Error(`Module ${i + 1} insertion failed: ${moduleError.message || "Unknown error"}`)
        }
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      })

      // Redirect to the course page
      router.push(`/courses/${course.id}`)
    } catch (error) {
      console.error("Error creating course:", error)

      let errorMessage = "Failed to create course. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              <p className="text-sm text-muted-foreground">Give your course a clear and descriptive title.</p>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn in this course"
                className="min-h-[120px]"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <p className="text-sm text-muted-foreground">
                Provide a detailed description of your course content and learning outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {courseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                <p className="text-sm text-muted-foreground">Choose the category that best fits your course.</p>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Course Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 8 weeks, 10 hours, etc."
                />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                <p className="text-sm text-muted-foreground">Specify how long it takes to complete this course.</p>
              </div>

              {/* Instructor */}
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Enter instructor name"
                />
                {errors.instructor && <p className="text-sm text-red-500">{errors.instructor}</p>}
                <p className="text-sm text-muted-foreground">Enter the name of the course instructor.</p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Course Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                <p className="text-sm text-muted-foreground">Provide a URL for the course thumbnail image.</p>
              </div>
            </div>

            {/* Course URL */}
            <div className="space-y-2">
              <Label htmlFor="courseUrl">Course URL</Label>
              <Input
                id="courseUrl"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
                placeholder="https://example.com/your-course"
              />
              {errors.courseUrl && <p className="text-sm text-red-500">{errors.courseUrl}</p>}
              <p className="text-sm text-muted-foreground">
                Enter the URL where students can access your course content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Modules</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addModule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.modules && <p className="text-sm text-red-500">{errors.modules}</p>}

            {modules.map((module, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Module {index + 1}</h3>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {/* Module Title */}
                <div className="space-y-2">
                  <Label htmlFor={`module-${index}-title`}>Module Title</Label>
                  <Input
                    id={`module-${index}-title`}
                    value={module.title}
                    onChange={(e) => updateModule(index, "title", e.target.value)}
                    placeholder="Enter module title"
                  />
                  {errors[`module_${index}_title`] && (
                    <p className="text-sm text-red-500">{errors[`module_${index}_title`]}</p>
                  )}
                </div>

                {/* Module Description */}
                <div className="space-y-2">
                  <Label htmlFor={`module-${index}-description`}>Module Description (Optional)</Label>
                  <Textarea
                    id={`module-${index}-description`}
                    value={module.description}
                    onChange={(e) => updateModule(index, "description", e.target.value)}
                    placeholder="Describe this module"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  )
}

