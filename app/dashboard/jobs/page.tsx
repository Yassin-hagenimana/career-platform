"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"
import { Building2, Briefcase, Clock, Edit, Eye, MapPin, Plus, Trash2, Users } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function JobsDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  useEffect(() => {
    if (!user) return

    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        // Fetch jobs posted by the user
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (jobsError) throw jobsError

        setJobs(jobsData || [])

        // Fetch job applications submitted by the user
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("job_applications")
          .select(`
            *,
            jobs:job_id (
              id,
              title,
              company,
              logo,
              location,
              type,
              category
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (applicationsError) throw applicationsError

        setApplications(applicationsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your jobs and applications",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [user, supabase, toast])

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)

      if (error) throw error

      setJobs(jobs.filter((job) => job.id !== jobId))

      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Button asChild>
            <Link href="/auth/login?redirect=/dashboard/jobs">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and applications</p>
        </div>
        <Button asChild>
          <Link href="/jobs/post">
            <Plus className="mr-2 h-4 w-4" />
            Post a New Job
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="posted" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posted">Jobs Posted</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="space-y-6">
          {isLoading ? (
            <JobsLoadingSkeleton />
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No jobs posted yet</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  You haven't posted any jobs yet. Post your first job to attract candidates.
                </p>
                <Button asChild>
                  <Link href="/jobs/post">
                    <Plus className="mr-2 w-4 h-4" />
                    Post Your First Job
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={job.logo || "/placeholder.svg?height=64&width=64"}
                        alt={job.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">
                            <Link href={`/jobs/${job.id}`} className="hover:underline">
                              {job.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge variant="outline">{job.level}</Badge>
                          {job.is_remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="mr-1 h-3.5 w-3.5" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3.5 w-3.5" />
                          <span>{job.applications_count || 0} applications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="font-medium">Posted on:</span> {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${job.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the job posting and all
                              associated applications.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {isLoading ? (
            <JobsLoadingSkeleton />
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  You haven't applied to any jobs yet. Browse jobs to find your next opportunity.
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={application.jobs.logo || "/placeholder.svg?height=64&width=64"}
                        alt={application.jobs.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">
                            <Link href={`/jobs/${application.job_id}`} className="hover:underline">
                              {application.jobs.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{application.jobs.company}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{application.jobs.type}</Badge>
                          <Badge
                            variant={
                              application.status === "pending"
                                ? "outline"
                                : application.status === "reviewing"
                                  ? "secondary"
                                  : application.status === "accepted"
                                    ? "success"
                                    : application.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          <span>{application.jobs.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="mr-1 h-3.5 w-3.5" />
                          <span>{application.jobs.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="font-medium">Application Status:</span>{" "}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${application.job_id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Job
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JobsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

