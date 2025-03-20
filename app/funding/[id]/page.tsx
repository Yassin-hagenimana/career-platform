import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ArrowLeft, ArrowRight, Check, DollarSign, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

async function getFundingOpportunity(id: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: funding, error } = await supabase.from("funding_opportunities").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching funding opportunity:", error)
      throw error
    }

    return funding
  } catch (error) {
    console.error("Error in getFundingOpportunity:", error)
    throw error
  }
}

export default async function FundingDetailPage({ params }: { params: { id: string } }) {
  try {
    // Validate that we're not trying to render the apply page
    if (params.id === "apply" || params.id === "apply-form") {
      return notFound()
    }

    const funding = await getFundingOpportunity(params.id)

    if (!funding) {
      return notFound()
    }

    // Calculate days remaining until deadline
    let daysRemaining = 0
    let formattedDeadline = "No deadline specified"
    let progress = 0

    if (funding.deadline) {
      const deadline = new Date(funding.deadline)
      const today = new Date()
      daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Format deadline
      formattedDeadline = deadline.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Calculate progress (days passed / total days)
      const totalDays = 90 // Assuming a typical application window is 90 days
      const daysPassed = totalDays - daysRemaining
      progress = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100))
    }

    // Ensure organization has a default value
    const organizationName = funding.provider || "Unknown Organization"
    const organizationFirstLetter = organizationName.charAt(0)
    const categoryName = funding.category || "opportunity"

    // Parse amount to ensure it's a number for formatting
    let amountValue = 0
    try {
      amountValue =
        typeof funding.amount === "string"
          ? Number.parseFloat(funding.amount)
          : typeof funding.amount === "number"
            ? funding.amount
            : 0
    } catch (error) {
      console.error("Error parsing amount:", error)
    }

    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/funding">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Funding Opportunities
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{funding.category || "Funding"}</Badge>
              {daysRemaining > 0 ? (
                <Badge variant="secondary">{daysRemaining} days remaining</Badge>
              ) : (
                <Badge variant="destructive">Deadline passed</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{funding.title}</h1>

            <div className="flex items-center text-muted-foreground mb-6">
              <span>Offered by</span>
              <span className="font-medium text-foreground ml-1">{organizationName}</span>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg mb-6">{funding.full_description || funding.description}</p>

              <h2 className="text-xl font-bold mt-8 mb-4">Eligibility Requirements</h2>
              {Array.isArray(funding.eligibility) ? (
                <ul className="space-y-2">
                  {funding.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      {typeof funding.eligibility === "string"
                        ? funding.eligibility
                        : "No eligibility criteria specified"}
                    </span>
                  </li>
                </ul>
              )}

              {funding.requirements && (
                <>
                  <h2 className="text-xl font-bold mt-8 mb-4">Application Requirements</h2>
                  {Array.isArray(funding.requirements) ? (
                    <ul className="space-y-2">
                      {funding.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {typeof funding.requirements === "string"
                            ? funding.requirements
                            : "No requirements specified"}
                        </span>
                      </li>
                    </ul>
                  )}
                </>
              )}

              {funding.benefits && (
                <>
                  <h2 className="text-xl font-bold mt-8 mb-4">Benefits</h2>
                  {Array.isArray(funding.benefits) ? (
                    <ul className="space-y-2">
                      {funding.benefits.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{typeof funding.benefits === "string" ? funding.benefits : "No benefits specified"}</span>
                      </li>
                    </ul>
                  )}
                </>
              )}

              {funding.application_process && (
                <>
                  <h2 className="text-xl font-bold mt-8 mb-4">Application Process</h2>
                  {Array.isArray(funding.application_process) ? (
                    <ol className="space-y-4">
                      {funding.application_process.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className="space-y-4">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          1
                        </div>
                        <span>
                          {typeof funding.application_process === "string"
                            ? funding.application_process
                            : "No application process specified"}
                        </span>
                      </li>
                    </ol>
                  )}
                </>
              )}

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href={`/funding/apply-form?fundingId=${params.id}`}>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Details</CardTitle>
                <CardDescription>Key information about this opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-lg">${amountValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">{formattedDeadline}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{funding.category || "Funding"}</Badge>
                </div>

                <div className="space-y-1 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Time remaining:</span>
                    <span className={`font-medium ${daysRemaining < 7 ? "text-red-500" : ""}`}>
                      {daysRemaining > 0 ? `${daysRemaining} days` : "Deadline passed"}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {funding.contact_email && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Contact:</span>
                    <a href={`mailto:${funding.contact_email}`} className="text-primary hover:underline">
                      {funding.contact_email}
                    </a>
                  </div>
                )}

                {funding.website && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Website:</span>
                    <a
                      href={funding.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Visit
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>{organizationName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  {funding.logo_url ? (
                    <img
                      src={funding.logo_url || "/placeholder.svg"}
                      alt={organizationName}
                      className="h-16 object-contain"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                      {organizationFirstLetter}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {organizationName} is committed to supporting {categoryName.toLowerCase()}s for qualified individuals
                  and organizations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Innovation Grant Program</h4>
                    <p className="text-sm text-muted-foreground">$15,000 - Deadline in 45 days</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Diversity in Tech Fund</h4>
                    <p className="text-sm text-muted-foreground">$20,000 - Deadline in 60 days</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Entrepreneurship Bootcamp</h4>
                    <p className="text-sm text-muted-foreground">$5,000 - Deadline in 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in FundingDetailPage:", error)
    // Return a simple error UI instead of throwing
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/funding">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Funding Opportunities
          </Link>
        </Button>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Funding Opportunity</CardTitle>
            <CardDescription>Unable to load funding details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We encountered an issue while loading this funding opportunity. Please try again later or view other
              opportunities.
            </p>
            <Button asChild>
              <Link href="/funding">View All Opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

