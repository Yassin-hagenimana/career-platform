import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, Search, Building2, Bookmark } from "lucide-react"

export const dynamic = "force-dynamic"

async function getJobs(category?: string, search?: string) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from("jobs").select("*").order("created_at", { ascending: false })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  return data
}

async function getCategories() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from("jobs").select("category").order("category")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Get unique categories
  const uniqueCategories = Array.from(new Set(data.map((job) => job.category)))
  return uniqueCategories
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const category = searchParams.category || "all"
  const search = searchParams.search || ""

  const jobsPromise = getJobs(category, search)
  const categoriesPromise = getCategories()

  const [jobs, categories] = await Promise.all([jobsPromise, categoriesPromise])

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
          <p className="text-muted-foreground mt-2">Find your next opportunity from our curated list of tech jobs</p>
        </div>
        <Button asChild>
          <Link href="/jobs/post">Post a Job</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Search</h2>
            <form action="/jobs" method="GET">
              {category !== "all" && <input type="hidden" name="category" value={category} />}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search jobs..."
                  defaultValue={search}
                  className="pl-8"
                />
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              {(category !== "all" || search) && (
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                  <Link href="/jobs">Clear All</Link>
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/jobs"
                    className={`text-sm ${
                      category === "all" ? "text-primary font-medium" : "text-muted-foreground"
                    } hover:text-primary`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/jobs?category=${cat}`}
                      className={`text-sm ${
                        category === cat ? "text-primary font-medium" : "text-muted-foreground"
                      } hover:text-primary`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="remote">Remote</TabsTrigger>
                <TabsTrigger value="fulltime">Full-time</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{jobs.length}</span> jobs
              </div>
            </div>
            <TabsContent value="all" className="space-y-4 mt-6">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No jobs found</h3>
                  <p className="text-muted-foreground mt-2 mb-6">We couldn't find any jobs matching your criteria.</p>
                  <Button asChild>
                    <Link href="/jobs">Clear Filters</Link>
                  </Button>
                </div>
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
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm">
                          {job.salary ? (
                            <span className="font-medium">{job.salary}</span>
                          ) : (
                            <span className="text-muted-foreground">Salary not disclosed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Bookmark className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="remote" className="space-y-4 mt-6">
              <Suspense fallback={<JobsLoadingSkeleton />}>
                {jobs.filter((job) => job.is_remote).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No remote jobs found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      We couldn't find any remote jobs matching your criteria.
                    </p>
                    <Button asChild>
                      <Link href="/jobs">Clear Filters</Link>
                    </Button>
                  </div>
                ) : (
                  jobs
                    .filter((job) => job.is_remote)
                    .map((job) => (
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
                                  <Badge variant="outline">Remote</Badge>
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
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-sm">
                              {job.salary ? (
                                <span className="font-medium">{job.salary}</span>
                              ) : (
                                <span className="text-muted-foreground">Salary not disclosed</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Bookmark className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </Suspense>
            </TabsContent>
            <TabsContent value="fulltime" className="space-y-4 mt-6">
              <Suspense fallback={<JobsLoadingSkeleton />}>
                {jobs.filter((job) => job.type === "Full-time").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No full-time jobs found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      We couldn't find any full-time jobs matching your criteria.
                    </p>
                    <Button asChild>
                      <Link href="/jobs">Clear Filters</Link>
                    </Button>
                  </div>
                ) : (
                  jobs
                    .filter((job) => job.type === "Full-time")
                    .map((job) => (
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
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-sm">
                              {job.salary ? (
                                <span className="font-medium">{job.salary}</span>
                              ) : (
                                <span className="text-muted-foreground">Salary not disclosed</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Bookmark className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </Suspense>
            </TabsContent>
            <TabsContent value="contract" className="space-y-4 mt-6">
              <Suspense fallback={<JobsLoadingSkeleton />}>
                {jobs.filter((job) => job.type === "Contract").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No contract jobs found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      We couldn't find any contract jobs matching your criteria.
                    </p>
                    <Button asChild>
                      <Link href="/jobs">Clear Filters</Link>
                    </Button>
                  </div>
                ) : (
                  jobs
                    .filter((job) => job.type === "Contract")
                    .map((job) => (
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
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-sm">
                              {job.salary ? (
                                <span className="font-medium">{job.salary}</span>
                              ) : (
                                <span className="text-muted-foreground">Salary not disclosed</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Bookmark className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

