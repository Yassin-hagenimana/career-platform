import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DollarSign, Clock, ArrowRight, CheckCircle, XCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreateFundingDialog } from "../funding/create-funding-dialog"

async function getFundingApplications() {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create the funding_applications table if it doesn't exist
    await supabase.rpc("create_funding_applications_table_if_not_exists")

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return []

    // Fetch user's funding applications
    const { data: applications, error } = await supabase
      .from("funding_applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return applications || []
  } catch (error) {
    console.error("Error fetching funding applications:", error)
    return []
  }
}

async function getCreatedFundingOpportunities() {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return []

    // Fetch funding opportunities created by the user
    const { data: opportunities, error } = await supabase
      .from("funding_opportunities")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return opportunities || []
  } catch (error) {
    console.error("Error fetching created funding opportunities:", error)
    return []
  }
}

export default async function DashboardFundingPage() {
  const applications = await getFundingApplications()
  const createdOpportunities = await getCreatedFundingOpportunities()

  // Group applications by status
  const pendingApplications = applications.filter((app) => app.status === "Pending")
  const approvedApplications = applications.filter((app) => app.status === "Approved")
  const rejectedApplications = applications.filter((app) => app.status === "Rejected")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Funding Dashboard</h2>
          <p className="text-muted-foreground">Manage your funding applications and opportunities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <CreateFundingDialog />
          <Button asChild>
            <Link href="/funding/apply">Apply for Funding</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Applications Yet</CardTitle>
                <CardDescription>You haven't submitted any funding applications yet</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Get Started</h3>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  Apply for grants, scholarships, and other funding opportunities to support your career growth and
                  projects.
                </p>
                <Button asChild>
                  <Link href="/funding">Browse Opportunities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {applications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending applications</p>
                ) : (
                  pendingApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedApplications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No approved applications</p>
                ) : (
                  approvedApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedApplications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No rejected applications</p>
                ) : (
                  rejectedApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {createdOpportunities.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Opportunities Created</CardTitle>
                <CardDescription>You haven't created any funding opportunities yet</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  <Plus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Create Your First Opportunity</h3>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  Create funding opportunities to support entrepreneurs, students, and professionals in their career
                  journey.
                </p>
                <CreateFundingDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {createdOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplicationCard({ application }) {
  // Format date
  const formattedDate = new Date(application.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.organization}</CardTitle>
            <CardDescription>
              {application.funding_type} - ${application.amount.toLocaleString()}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timeline:</span>
            <span>{application.timeline}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Purpose:</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{application.purpose}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/funding/applications/${application.id}`}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function OpportunityCard({ opportunity }) {
  // Format date
  const formattedDate = new Date(opportunity.deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{opportunity.title}</CardTitle>
            <CardDescription>{opportunity.provider}</CardDescription>
          </div>
          <Badge variant={opportunity.featured ? "default" : "outline"} className="ml-2">
            {opportunity.featured ? "Featured" : opportunity.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span>${opportunity.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deadline:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Applicants:</span>
            <span>{opportunity.applicants || 0}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Description:</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/funding/${opportunity.id}`}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

