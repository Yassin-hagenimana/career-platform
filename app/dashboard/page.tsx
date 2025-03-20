"use client"

import { useState } from "react"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, Clock, Award, TrendingUp, Users, FileText, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { useSupabase } from "@/hooks/use-Supabase"
import { useAuth } from "@/contexts/auth-context"
//import { useRouter } from "next/router" // Added to handle redirection
import { useRouter } from 'next/navigation';


const recommendedCourses = [
  {
    id: 3,
    title: "Business Plan Development",
    category: "Business",
    level: "Beginner",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    title: "Graphic Design for Entrepreneurs",
    category: "Design",
    level: "Beginner",
    image: "/placeholder.svg?height=100&width=200",
  },
]

const fundingOpportunities = [
  {
    id: 1,
    title: "Tech Startup Grant",
    amount: "$5,000",
    deadline: "April 10, 2025",
    category: "Technology",
  },
  {
    id: 2,
    title: "Women in Business Fund",
    amount: "$7,500",
    deadline: "March 30, 2025",
    category: "Entrepreneurship",
  },
]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([])
  const [skills, setSkills] = useState([])
  const [stats, setStats] = useState({
    coursesEnrolled: 0, workshopsAttended: 0, hoursSpent: 0, certificatesEarned: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const router = useRouter() // Added router for redirection

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/auth/login") // Redirect if not authenticated
      } else {
        fetchDashboardData() // Fetch dashboard data after session check
        setIsLoading(false)
      }
    }

    checkSession() // Trigger session check when the component mounts
  }, [supabase, router]) // Triggered when `supabase` or `router` changes

  const fetchDashboardData = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const { data: courses } = await supabase
        .from("course_enrollments")
        .select(`
        id,
        progress,
        courses (
          id,
          title,
          image_url
        )
      `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2)

      // Fetch upcoming workshops
      const { data: workshops } = await supabase
        .from("workshop_registrations")
        .select(`
        id,
        workshops (
          id,
          title,
          date,
          time,
          registered_count,
          instructor_name
        )
      `)
        .eq("user_id", user.id)
        .gte("workshops.date", new Date().toISOString().split("T")[0])
        .order("workshops.date", { ascending: true })
        .limit(2)

      const formattedCourses =
        courses?.map((enrollment) => ({
          id: enrollment.courses.id,
          title: enrollment.courses.title,
          progress: enrollment.progress,
          nextLesson: "Next lesson",
          image: enrollment.courses.image_url || "/placeholder.svg?height=100&width=200",
          dueDate: "2 days",
        })) || []

      const formattedWorkshops =
        workshops?.map((registration) => ({
          id: registration.workshops.id,
          title: registration.workshops.title,
          date: new Date(registration.workshops.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: registration.workshops.time,
          host: registration.workshops.instructor_name,
          attendees: registration.workshops.registered_count,
        })) || []

      // Set the data
      setEnrolledCourses(formattedCourses)
      setUpcomingWorkshops(formattedWorkshops)

      // Get stats
      const { count: coursesCount } = await supabase
        .from("course_enrollments")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)

      const { count: workshopsCount } = await supabase
        .from("workshop_registrations")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)

      setStats({
        coursesEnrolled: coursesCount || 0,
        workshopsAttended: workshopsCount || 0,
        hoursSpent: 28.5, // This would need a proper calculation in a real app
        certificatesEarned: 1, // This would need a proper calculation in a real app
      })

      // Get skills (this would be more complex in a real app)
      setSkills([
        { name: "Web Development", level: 65 },
        { name: "Digital Marketing", level: 40 },
        { name: "Business Planning", level: 25 },
        { name: "Graphic Design", level: 15 },
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardNav activeItem="dashboard" />

      <div className="flex-1">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}! Here's your learning progress.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                My Certificates
              </Button>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                Career Path
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Workshops Attended</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.workshopsAttended}</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hours Spent Learning</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.hoursSpent}</div>
                    <p className="text-xs text-muted-foreground">+8.2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Current Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Continue Learning</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/courses">
                      View all courses <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>Next: {course.nextLesson}</CardDescription>
                          </div>
                          <div className="relative h-12 w-20 overflow-hidden rounded">
                            <Image
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          Due in {course.dueDate}
                        </div>
                        <Button size="sm">
                          <Link href="/courses">Continue</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upcoming Workshops */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Workshops</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/workshops">
                      View all workshops <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingWorkshops.map((workshop) => (
                    <Card key={workshop.id}>
                      <CardHeader>
                        <CardTitle>{workshop.title}</CardTitle>
                        <CardDescription>Hosted by {workshop.host}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.attendees} attendees</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Join Workshop
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Skills Progress */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills Progress</h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-8">
              <div className="grid gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {enrolledCourses.map((course) => (
                      <Card key={course.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="space-y-1">
                              <CardTitle>{course.title}</CardTitle>
                              <CardDescription>Next: {course.nextLesson}</CardDescription>
                            </div>
                            <div className="relative h-12 w-20 overflow-hidden rounded">
                              <Image
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            Due in {course.dueDate}
                          </div>
                          <Button size="sm">Continue</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedCourses.map((course) => (
                      <Card key={course.id}>
                        <div className="relative h-40 w-full">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <Badge variant="secondary">{course.category}</Badge>
                          </div>
                          <CardDescription>Level: {course.level}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button variant="outline" className="w-full">
                            Enroll Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="workshops" className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Upcoming Workshops</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingWorkshops.map((workshop) => (
                    <Card key={workshop.id}>
                      <CardHeader>
                        <CardTitle>{workshop.title}</CardTitle>
                        <CardDescription>Hosted by {workshop.host}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workshop.attendees} attendees</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Join Workshop
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Past Workshops</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Introduction to Entrepreneurship</CardTitle>
                          <CardDescription>Hosted by John Doe</CardDescription>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">February 28, 2025</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">1:00 PM - 3:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">35 attendees</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        View Recording
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Get Certificate
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Financial Literacy for Startups</CardTitle>
                          <CardDescription>Hosted by Jane Smith</CardDescription>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">February 15, 2025</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">10:00 AM - 12:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">42 attendees</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        View Recording
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Get Certificate
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="funding" className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Funding Opportunities</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {fundingOpportunities.map((opportunity) => (
                    <Card key={opportunity.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{opportunity.title}</CardTitle>
                          <Badge variant="outline">{opportunity.category}</Badge>
                        </div>
                        <CardDescription>Up to {opportunity.amount} in funding</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Application Deadline: {opportunity.deadline}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Apply Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">My Applications</h2>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>Youth Innovation Fund</CardTitle>
                      <Badge variant="secondary">Under Review</Badge>
                    </div>
                    <CardDescription>Applied on February 10, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Application Status</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">Step 2 of 3</span>
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <Progress value={66} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Your application is currently being reviewed by our funding committee. You will be notified of
                        the next steps within 7 days.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Application
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

