import Link from "next/link"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building2, Clock, Globe, MapPin, Share2 } from "lucide-react"

export const dynamic = "force-dynamic"

async function getJob(id: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={job.logo || "/placeholder.svg?height=80&width=80"}
                    alt={job.company}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.level}</Badge>
                    {job.is_remote && <Badge variant="outline">Remote</Badge>}
                  </div>
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
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="prose max-w-none">
                    <p>{job.description}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2">
                      {job.requirements?.split("\n").map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2">
                      {job.responsibilities?.split("\n").map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2">
                      {job.benefits?.split("\n").map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Job Overview</h2>
                <dl className="space-y-4">
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Job Type</dt>
                    <dd>{job.type}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Experience</dt>
                    <dd>{job.level}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Location</dt>
                    <dd>{job.location}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Remote</dt>
                    <dd>{job.is_remote ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Salary</dt>
                    <dd>{job.salary || "Not disclosed"}</dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-32 flex-shrink-0 text-muted-foreground">Posted</dt>
                    <dd>{new Date(job.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <Separator />

              <div className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/jobs/${job.id}/apply`}>Apply for this job</Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Job
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">About {job.company}</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {job.company_description || `${job.company} is a leading company in the ${job.category} industry.`}
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-8">
                    <Globe className="mr-2 h-3.5 w-3.5" />
                    Visit Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

