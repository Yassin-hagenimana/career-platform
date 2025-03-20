import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BookOpen, Edit, Eye, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// In the getUserCourses function, add error handling for table not existing
async function getUserCourses(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create courses table if it doesn't exist
    await supabase.rpc("create_courses_table_if_not_exists")

    const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        description,
        price,
        level,
        category,
        image_url,
        students_count,
        rating,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching courses:", error)
      return []
    }

    return courses || []
  } catch (error) {
    console.error("Error in getUserCourses:", error)
    return []
  }
}

// In the getUserEnrollments function, add error handling for table not existing
async function getUserEnrollments(userId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create course_enrollments table if it doesn't exist
    await supabase.rpc("create_course_enrollments_table_if_not_exists")

    const { data: enrollments, error } = await supabase
      .from("course_enrollments")
      .select(`
        id,
        created_at,
        progress,
        course:course_id (
          id,
          title,
          description,
          level,
          category,
          image_url,
          instructor_name
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return []
    }

    // Format the data to match the expected structure
    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      created_at: enrollment.created_at,
      progress: enrollment.progress,
      courses: enrollment.course,
    }))

    return formattedEnrollments || []
  } catch (error) {
    console.error("Error in getUserEnrollments:", error)
    return []
  }
}

export default async function DashboardCoursesPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?redirect=/dashboard/courses")
  }

  const userId = session.user.id
  const courses = await getUserCourses(userId)
  const enrollments = await getUserEnrollments(userId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Manage your courses and track your learning progress</p>
        </div>
        <Button asChild>
          <Link href="/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="my-courses" className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No courses created yet</CardTitle>
                <CardDescription>
                  You haven't created any courses yet. Start creating your first course to share your knowledge.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/courses/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={course.image_url || "/placeholder.svg?height=225&width=400"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{course.category}</Badge>
                      <div className="flex items-center text-amber-500">
                        <span className="text-xs">{course.rating || "Not rated"}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.level}</span>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <span>${course.price}</span>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <span>{course.students_count || 0} students</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="enrolled" className="space-y-4">
          {enrollments.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No enrolled courses</CardTitle>
                <CardDescription>
                  You haven't enrolled in any courses yet. Browse our course catalog to find courses that interest you.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={enrollment.courses.image_url || "/placeholder.svg?height=225&width=400"}
                      alt={enrollment.courses.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{enrollment.courses.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{enrollment.courses.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{enrollment.courses.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{enrollment.courses.level}</span>
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <span>Instructor: {enrollment.courses.instructor_name}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{enrollment.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${enrollment.progress || 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center border-t">
                    <Button asChild>
                      <Link href={`/courses/${enrollment.courses.id}`}>
                        {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

