import Link from "next/link"
import { ArrowLeft, Calendar, DollarSign, Building, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

async function getApplicationById(id: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return null

    // Fetch the specific application
    const { data: application, error } = await supabase
      .from("funding_applications")
      .select("*, funding_opportunities(*)")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("Error fetching application:", error)
      return null
    }

    return application
  } catch (error) {
    console.error("Error fetching application:", error)
    return null
  }
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function FundingApplicationDetailsPage({ params }: { params: { id: string } }) {
  const applicationId = params.id
  const application = await getApplicationById(applicationId)

  if (!application) {
    notFound()
  }

  // Define application stages based on status
  const applicationStages = [
    {
      stage: "Application Submitted",
      date: new Date(application.created_at).toISOString(),
      completed: true,
    },
    {
      stage: "Initial Screening",
      date: new Date(new Date(application.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days after submission
      completed: ["Under Review", "Shortlisted", "Approved", "Rejected"].includes(application.status),
    },
    {
      stage: "Detailed Review",
      date: new Date(new Date(application.created_at).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days after submission
      completed: ["Shortlisted", "Approved", "Rejected"].includes(application.status),
    },
    {
      stage: "Committee Decision",
      date: new Date(new Date(application.created_at).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days after submission
      completed: ["Approved", "Rejected"].includes(application.status),
    },
    {
      stage: "Funding Disbursement",
      date: application.status === "Approved" ? new Date(application.updated_at).toISOString() : null,
      completed: application.status === "Approved",
    },
  ]

  // Calculate progress percentage based on completed timeline stages
  const completedStages = applicationStages.filter((stage) => stage.completed).length
  const totalStages = applicationStages.length
  const progressPercentage = (completedStages / totalStages) * 100

  // Map status to UI elements
  const statusMap = {
    Pending: "pending",
    "Under Review": "under_review",
    Shortlisted: "shortlisted",
    Approved: "approved",
    Rejected: "rejected",
  }

  const status = statusMap[application.status] || "pending"

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    shortlisted: "bg-purple-100 text-purple-800",
    rejected: "bg-red-100 text-red-800",
    approved: "bg-green-100 text-green-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    shortlisted: "Shortlisted",
    rejected: "Not Selected",
    approved: "Approved",
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/funding">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">
                  {application.funding_opportunities?.title || "Funding Opportunity"}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  {application.organization || "Your Organization"}
                </CardDescription>
              </div>
              <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Applied on {new Date(application.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Requested: {formatCurrency(application.amount || 0)}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Application Progress</h3>
              <Progress value={progressPercentage} className="h-2 mb-4" />
              <div className="space-y-3">
                {applicationStages.map((stage, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {stage.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground opacity-50" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{stage.stage}</p>
                      <p className="text-sm text-muted-foreground">
                        {stage.date ? new Date(stage.date).toLocaleDateString() : "Date to be determined"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-medium">{application.organization || "Not specified"}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-medium">{application.business_type || "Not specified"}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Business Sector</p>
                  <p className="font-medium">
                    {application.business_sector || application.funding_type || "Not specified"}
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Business Stage</p>
                  <p className="font-medium">{application.business_stage || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Funding Purpose</h3>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p>{application.purpose || "No purpose specified"}</p>
              </div>
            </div>

            {application.impact && (
              <div>
                <h3 className="font-medium mb-2">Expected Impact</h3>
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p>{application.impact}</p>
                </div>
              </div>
            )}

            {application.feedback && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Reviewer Feedback</h3>
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <p>{application.feedback}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/funding">Back to Applications</Link>
            </Button>
            {application.funding_opportunities && (
              <Button asChild>
                <Link href={`/funding/${application.funding_opportunities.id}`}>View Funding Opportunity</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

