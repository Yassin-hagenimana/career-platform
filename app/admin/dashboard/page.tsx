"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  BarChart,
  TrendingUp,
  TrendingDown,
  UserPlus,
  GraduationCap,
  MessageSquare,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState("7d")

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Admin Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin Panel</span>
          </div>
        </div>
        <div className="flex-1 py-6">
          <nav className="grid gap-1 px-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-accent text-accent-foreground"
            >
              <BarChart className="h-5 w-5" />
              <span>Dashboard</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/courses"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>
            <Link
              href="/admin/workshops"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <Calendar className="h-5 w-5" />
              <span>Workshops</span>
            </Link>
            <Link
              href="/admin/funding"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <DollarSign className="h-5 w-5" />
              <span>Funding</span>
            </Link>
            <Link
              href="/admin/community"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Community</span>
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <FileText className="h-5 w-5" />
              <span>Reports</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor platform performance and user activity</p>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25,432</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+12.5% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18,756</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+8.2% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workshop Attendees</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,287</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+15.3% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funding Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <div className="flex items-center text-xs text-red-500">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>-3.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">[User Growth Chart Visualization]</div>
                </CardContent>
              </Card>

              {/* Platform Activity */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>User engagement across features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Course Engagement</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Workshop Attendance</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Community Participation</span>
                          <span className="font-medium">42%</span>
                        </div>
                        <Progress value={42} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funding Applications</span>
                          <span className="font-medium">31%</span>
                        </div>
                        <Progress value={31} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>Users by role and region</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">[User Distribution Chart Visualization]</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New User Registration</p>
                        <p className="text-xs text-muted-foreground">John Doe from Kenya joined the platform</p>
                      </div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Course Published</p>
                        <p className="text-xs text-muted-foreground">Digital Marketing Fundamentals is now available</p>
                      </div>
                      <div className="text-xs text-muted-foreground">5 hours ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Funding Approved</p>
                        <p className="text-xs text-muted-foreground">$10,000 grant approved for EcoSolar Solutions</p>
                      </div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Workshop Scheduled</p>
                        <p className="text-xs text-muted-foreground">
                          Financial Literacy for Startups scheduled for next week
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-8">
              {/* User Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">User Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25,432</div>
                    <div className="text-xs text-muted-foreground">Total Users</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Job Seekers</span>
                        <span>15,245 (60%)</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Entrepreneurs</span>
                        <span>7,629 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Mentors</span>
                        <span>2,558 (10%)</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+1,245</div>
                    <div className="text-xs text-muted-foreground">New users this month</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Organic</span>
                        <span>745 (60%)</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Referrals</span>
                        <span>375 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Campaigns</span>
                        <span>125 (10%)</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">User Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-xs text-muted-foreground">30-day retention rate</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Job Seekers</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Entrepreneurs</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Mentors</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                      </div>
                      <Badge>Job Seeker</Badge>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Jane Smith</p>
                        <p className="text-xs text-muted-foreground">jane.smith@example.com</p>
                      </div>
                      <Badge>Entrepreneur</Badge>
                      <div className="text-xs text-muted-foreground">5 hours ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>MO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Michael Okafor</p>
                        <p className="text-xs text-muted-foreground">michael.okafor@example.com</p>
                      </div>
                      <Badge>Mentor</Badge>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Amina Diallo</p>
                        <p className="text-xs text-muted-foreground">amina.diallo@example.com</p>
                      </div>
                      <Badge>Job Seeker</Badge>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Users
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-8">
              {/* Content Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">150</div>
                    <div className="text-xs text-muted-foreground">Total courses</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Technology</span>
                        <span>45 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Business</span>
                        <span>38 (25%)</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Marketing</span>
                        <span>30 (20%)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <span>37 (25%)</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68</div>
                    <div className="text-xs text-muted-foreground">Total workshops</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upcoming</span>
                        <span>24 (35%)</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>44 (65%)</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,845</div>
                    <div className="text-xs text-muted-foreground">Total discussions</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Career Advice</span>
                        <span>1,538 (40%)</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Entrepreneurship</span>
                        <span>1,153 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <span>1,154 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Content</CardTitle>
                  <CardDescription>Most engaged courses and workshops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Web Development Fundamentals</p>
                        <p className="text-xs text-muted-foreground">1,245 enrollments, 85% completion rate</p>
                      </div>
                      <Badge>Course</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Building Your Personal Brand</p>
                        <p className="text-xs text-muted-foreground">245 attendees, 92% satisfaction rate</p>
                      </div>
                      <Badge>Workshop</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Digital Marketing Essentials</p>
                        <p className="text-xs text-muted-foreground">980 enrollments, 78% completion rate</p>
                      </div>
                      <Badge>Course</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Networking for Career Growth</p>
                        <p className="text-xs text-muted-foreground">198 attendees, 88% satisfaction rate</p>
                      </div>
                      <Badge>Workshop</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Content
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="funding" className="space-y-8">
              {/* Funding Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Funding Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1.2M</div>
                    <div className="text-xs text-muted-foreground">Total funding disbursed</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Technology</span>
                        <span>$480K (40%)</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Agriculture</span>
                        <span>$300K (25%)</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Healthcare</span>
                        <span>$240K (20%)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <span>$180K (15%)</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <div className="text-xs text-muted-foreground">Total applications</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Approved</span>
                        <span>249 (20%)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Pending</span>
                        <span>373 (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Rejected</span>
                        <span>623 (50%)</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-xs text-muted-foreground">Funded ventures still operating</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Technology</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Agriculture</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest funding applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">EcoSolar Solutions</p>
                        <p className="text-xs text-muted-foreground">Renewable energy startup from Kenya</p>
                      </div>
                      <div className="text-sm font-medium">$15,000</div>
                      <Badge variant="outline">Under Review</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">FarmTech Africa</p>
                        <p className="text-xs text-muted-foreground">AgriTech startup from Nigeria</p>
                      </div>
                      <div className="text-sm font-medium">$12,000</div>
                      <Badge variant="outline">Under Review</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>MO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">HealthConnect</p>
                        <p className="text-xs text-muted-foreground">Healthcare platform from Ghana</p>
                      </div>
                      <div className="text-sm font-medium">$20,000</div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">EduTech Solutions</p>
                        <p className="text-xs text-muted-foreground">EdTech startup from South Africa</p>
                      </div>
                      <div className="text-sm font-medium">$18,000</div>
                      <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Applications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

