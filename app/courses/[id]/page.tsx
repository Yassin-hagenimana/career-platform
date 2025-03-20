import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
export const dynamic = "force-dynamic"
import { EnrollButton } from "./enroll-button"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch the course
  const { data: course, error: courseError } = await supabase.from("courses").select("*").eq("id", params.id).single()

  if (courseError) {
    console.error("Error fetching course:", courseError)
    return notFound()
  }

  if (!course) {
    return notFound()
  }

  // Fetch the course modules
  const { data: modules, error: modulesError } = await supabase
    .from("course_modules")
    .select("*")
    .eq("course_id", course.id)
    .order("order", { ascending: true })

  if (modulesError) {
    console.error("Error fetching modules:", modulesError)
  }

  // Check if the current user is the creator of the course
  const isCreator = user?.id === course.created_by

  // Check if the user is enrolled in the course
  let isEnrolled = false
  if (user) {
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("course_id", course.id)
      .eq("user_id", user.id)
      .single()

    isEnrolled = !!enrollment
  }

  return (
    <div className="container py-10">
      <Link href="/courses" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant="outline">{course.category}</Badge>
                {course.price > 0 ? (
                  <Badge variant="secondary">${course.price}</Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Instructor: {course.instructor}</span>
            </div>
            {course.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Duration: {course.duration}</span>
              </div>
            )}
          </div>

          {course.image_url ? (
            <div className="rounded-lg overflow-hidden mb-6">
              <img src={course.image_url || "/placeholder.svg"} alt={course.title} className="w-full h-auto" />
            </div>
          ) : (
            <div className="rounded-lg bg-muted flex items-center justify-center h-64 mb-6">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          <div className="prose max-w-none dark:prose-invert mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this course</h2>
            <p>{course.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            {modules && modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={module.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">
                        Module {index + 1}: {module.title}
                      </CardTitle>
                    </CardHeader>
                    {module.description && (
                      <CardContent className="py-2">
                        <CardDescription>{module.description}</CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No modules available for this course.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Course Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <EnrollButton courseId={course.id} courseUrl={course.course_url} isEnrolled={isEnrolled} />
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/auth/login">Sign In to Enroll</Link>
                </Button>
              )}

              <Separator />

              {isCreator && (
                <div className="space-y-2">
                  <h3 className="font-medium">Creator Options</h3>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/courses/${course.id}/edit`}>Edit Course</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

