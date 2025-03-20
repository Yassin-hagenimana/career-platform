import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getApplicationById } from "@/lib/data/applications"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Clock, FileCheck, FileWarning } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id)

  if (!application) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FileCheck className="h-6 w-6 text-green-500" />
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "rejected":
        return <FileWarning className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/funding">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{application.fundingName}</h1>
          <p className="text-muted-foreground mt-2">Application ID: {application.id}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current status of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                {getStatusIcon(application.status)}
                <div>
                  <div className="text-xl font-semibold capitalize">{application.status}</div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(application.updatedAt || application.appliedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding Details</CardTitle>
              <CardDescription>Information about the requested funding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Amount Requested</div>
                <div className="text-xl font-semibold">{formatCurrency(application.amountRequested)}</div>
              </div>
              {application.amountApproved && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Amount Approved</div>
                  <div className="text-xl font-semibold">{formatCurrency(application.amountApproved)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Information you provided in your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div>{application.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{application.email}</div>
                </div>
                {application.phone && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div>{application.phone}</div>
                  </div>
                )}
                {application.address && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                    <div>{application.address}</div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Project Title</div>
                  <div>{application.projectTitle}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Project Description</div>
                  <div className="whitespace-pre-wrap">{application.projectDescription}</div>
                </div>
                {application.timeline && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Timeline</div>
                    <div>{application.timeline}</div>
                  </div>
                )}
                {application.goals && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Goals</div>
                    <div className="whitespace-pre-wrap">{application.goals}</div>
                  </div>
                )}
              </div>
            </div>

            {application.additionalInfo && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                  <div className="whitespace-pre-wrap">{application.additionalInfo}</div>
                </div>
              </>
            )}

            {application.feedback && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Reviewer Feedback</h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{application.feedback}</div>
                </div>
              </>
            )}
          </CardContent>
          {application.status === "approved" && (
            <CardFooter>
              <Button className="w-full">Accept Funding</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

