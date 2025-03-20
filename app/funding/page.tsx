import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Calendar, DollarSign, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

async function getFundingOpportunities() {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Create the funding table if it doesn't exist
    const { error: createError } = await supabase.rpc("create_funding_table_if_not_exists")
    if (createError) console.error("Error creating funding table:", createError)

    // Fetch funding opportunities
    const { data: funding, error } = await supabase
      .from("funding_opportunities")
      .select("*")
      .order("deadline", { ascending: true })

    if (error) throw error

    return funding || []
  } catch (error) {
    console.error("Error fetching funding opportunities:", error)

    // Return dummy data if there's an error
    return [
      {
        id: "1",
        title: "Tech Startup Grant",
        description: "Funding for innovative tech startups with a focus on sustainability.",
        amount: 25000,
        deadline: "2023-12-31",
        organization: "Future Tech Foundation",
        eligibility: ["Early-stage startups", "Tech sector", "Less than 2 years old"],
        category: "Grant",
        application_link: "#",
        logo_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Women in STEM Scholarship",
        description: "Supporting women pursuing careers in Science, Technology, Engineering, and Mathematics.",
        amount: 10000,
        deadline: "2023-11-15",
        organization: "Women in Tech Alliance",
        eligibility: ["Women", "STEM fields", "Undergraduate or graduate students"],
        category: "Scholarship",
        application_link: "#",
        logo_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Social Impact Accelerator",
        description: "Funding and mentorship for startups addressing social challenges.",
        amount: 50000,
        deadline: "2024-01-15",
        organization: "Change Makers Fund",
        eligibility: ["Social enterprises", "Proven impact", "Scalable solution"],
        category: "Accelerator",
        application_link: "#",
        logo_url: null,
        created_at: new Date().toISOString(),
      },
    ]
  }
}

export default async function FundingPage() {
  const fundingOpportunities = await getFundingOpportunities()

  // Group funding by category
  const grants = fundingOpportunities.filter((f) => f.category === "Grant")
  const scholarships = fundingOpportunities.filter((f) => f.category === "Scholarship")
  const accelerators = fundingOpportunities.filter((f) => f.category === "Accelerator")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Funding Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Discover grants, scholarships, and funding to support your career growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search opportunities..." className="w-full md:w-[300px] pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="accelerators">Accelerators</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingOpportunities.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="grants" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grants.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="scholarships" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="accelerators" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accelerators.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FundingCard({ funding }) {
  // Calculate days remaining until deadline
  const deadline = new Date(funding.deadline)
  const today = new Date()
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Format deadline
  const formattedDeadline = new Date(funding.deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate progress (days passed / total days)
  const totalDays = 90 // Assuming a typical application window is 90 days
  const daysPassed = totalDays - daysRemaining
  const progress = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100))

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{funding.category}</Badge>
          <div className="flex items-center text-primary">
            <DollarSign className="h-4 w-4" />
            <span className="ml-1 font-bold">${funding.amount.toLocaleString()}</span>
          </div>
        </div>
        <Link href={`/funding/${funding.id}`} className="hover:underline">
          <h3 className="text-lg font-bold line-clamp-2 mt-2">{funding.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{funding.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Organization:</span>
            <span className="font-medium">{funding.organization}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Deadline:</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-medium">{formattedDeadline}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Time remaining:</span>
              <span className={`font-medium ${daysRemaining < 7 ? "text-red-500" : ""}`}>
                {daysRemaining > 0 ? `${daysRemaining} days` : "Deadline passed"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Eligibility:</h4>
            {(() => {
              // Handle different types of eligibility data
              let eligibilityItems = []

              if (Array.isArray(funding.eligibility)) {
                eligibilityItems = funding.eligibility
              } else if (typeof funding.eligibility === "string") {
                try {
                  // Try to parse it as JSON
                  const parsed = JSON.parse(funding.eligibility)
                  eligibilityItems = Array.isArray(parsed) ? parsed : [funding.eligibility]
                } catch (e) {
                  // If not valid JSON, treat as a single string
                  eligibilityItems = [funding.eligibility]
                }
              } else if (funding.eligibility && typeof funding.eligibility === "object") {
                // If it's an object, use its values
                eligibilityItems = Object.values(funding.eligibility)
              } else {
                // Fallback for any other case
                eligibilityItems = ["No specific eligibility criteria"]
              }

              return (
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                  {eligibilityItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )
            })()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <Button asChild variant="outline" size="sm" className="items-center ml-24">
          <Link href={`/funding/${funding.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

