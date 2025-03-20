"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

// Import the server action
import { createFundingApplication } from "@/app/actions/funding-actions"

const fundingApplicationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  organization: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  funding_type: z.string().min(1, { message: "Please select a funding type." }),
  amount: z.string().min(1, { message: "Please enter the funding amount." }),
  purpose: z.string().min(50, { message: "Purpose must be at least 50 characters." }),
  timeline: z.string().min(1, { message: "Please enter your project timeline." }),
  background: z.string().min(50, { message: "Background must be at least 50 characters." }),
  impact: z.string().min(50, { message: "Impact statement must be at least 50 characters." }),
})

export default function ApplyForFundingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fundingDetails, setFundingDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    funding_type: "",
    amount: "",
    purpose: "",
    timeline: "",
    background: "",
    impact: "",
  })

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get funding opportunity ID from URL parameters
  const fundingId = searchParams.get("fundingId")

  // Fetch funding details if ID is provided
  useEffect(() => {
    async function fetchFundingDetails() {
      if (!fundingId) return

      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("funding_opportunities").select("*").eq("id", fundingId).single()

        if (error) {
          console.error("Error fetching funding details:", error)
          toast({
            title: "Error",
            description: "Could not load funding opportunity details",
            variant: "destructive",
          })
        } else if (data) {
          setFundingDetails(data)
          // Pre-fill funding type if available
          if (data.category) {
            setFormData((prev) => ({ ...prev, funding_type: data.category }))
          }
        }
      } catch (error) {
        console.error("Error in fetchFundingDetails:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFundingDetails()
  }, [fundingId, supabase])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters."
    }

    // Validate email
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    // Validate organization
    if (!formData.organization || formData.organization.length < 2) {
      newErrors.organization = "Organization name must be at least 2 characters."
    }

    // Validate funding_type
    if (!formData.funding_type) {
      newErrors.funding_type = "Please select a funding type."
    }

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = "Please enter the funding amount."
    }

    // Validate purpose
    if (!formData.purpose || formData.purpose.length < 50) {
      newErrors.purpose = "Purpose must be at least 50 characters."
    }

    // Validate timeline
    if (!formData.timeline) {
      newErrors.timeline = "Please enter your project timeline."
    }

    // Validate background
    if (!formData.background || formData.background.length < 50) {
      newErrors.background = "Background must be at least 50 characters."
    }

    // Validate impact
    if (!formData.impact || formData.impact.length < 50) {
      newErrors.impact = "Impact statement must be at least 50 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("email", formData.email)
      formDataObj.append("organization", formData.organization)
      formDataObj.append("funding_type", formData.funding_type)
      formDataObj.append("amount", formData.amount)
      formDataObj.append("purpose", formData.purpose)
      formDataObj.append("timeline", formData.timeline)
      formDataObj.append("background", formData.background)
      formDataObj.append("impact", formData.impact)

      // Add funding opportunity ID if available
      if (fundingId) {
        formDataObj.append("fundingId", fundingId)
      }

      if (user?.id) {
        formDataObj.append("userId", user.id)
      }

      const result = await createFundingApplication(formDataObj)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Application Submitted",
          description: "Your funding application has been submitted successfully.",
        })
        router.push("/funding/apply-form/success")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={fundingId ? `/funding/${fundingId}` : "/funding"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {fundingId ? "Back to Funding Opportunity" : "Back to Funding Opportunities"}
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Apply for Funding</h1>
        {fundingDetails && <p className="text-xl text-primary mt-2">{fundingDetails.title}</p>}
        <p className="text-muted-foreground mt-2">
          Complete the form below to apply for funding for your project or initiative
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
              <CardDescription>Provide your personal and organizational details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Organization Field */}
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  Organization Name
                </label>
                <Input
                  id="organization"
                  name="organization"
                  placeholder="Your organization or project name"
                  value={formData.organization}
                  onChange={handleChange}
                  className={errors.organization ? "border-red-500" : ""}
                />
                {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding Details</CardTitle>
              <CardDescription>Provide information about your funding request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funding Type Field */}
              <div className="space-y-2">
                <label htmlFor="funding_type" className="text-sm font-medium">
                  Funding Type
                </label>
                <Select
                  value={formData.funding_type}
                  onValueChange={(value) => handleSelectChange(value, "funding_type")}
                >
                  <SelectTrigger className={errors.funding_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select funding type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grant">Grant</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Loan">Loan</SelectItem>
                    <SelectItem value="Sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.funding_type && <p className="text-sm text-red-500">{errors.funding_type}</p>}
              </div>

              {/* Amount Field */}
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Requested Amount (USD)
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  placeholder="e.g. 10000"
                  value={formData.amount}
                  onChange={handleChange}
                  className={errors.amount ? "border-red-500" : ""}
                />
                <p className="text-sm text-muted-foreground">Enter the amount of funding you are requesting</p>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              {/* Timeline Field */}
              <div className="space-y-2">
                <label htmlFor="timeline" className="text-sm font-medium">
                  Project Timeline
                </label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="e.g. 6 months, January-June 2024"
                  value={formData.timeline}
                  onChange={handleChange}
                  className={errors.timeline ? "border-red-500" : ""}
                />
                <p className="text-sm text-muted-foreground">Specify the duration or timeframe for your project</p>
                {errors.timeline && <p className="text-sm text-red-500">{errors.timeline}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Provide details about your project or initiative</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purpose Field */}
              <div className="space-y-2">
                <label htmlFor="purpose" className="text-sm font-medium">
                  Purpose of Funding
                </label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  placeholder="Describe how you plan to use the funding..."
                  className={`min-h-[150px] ${errors.purpose ? "border-red-500" : ""}`}
                  value={formData.purpose}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">Clearly explain what the funding will be used for</p>
                {errors.purpose && <p className="text-sm text-red-500">{errors.purpose}</p>}
              </div>

              {/* Background Field */}
              <div className="space-y-2">
                <label htmlFor="background" className="text-sm font-medium">
                  Background & Experience
                </label>
                <Textarea
                  id="background"
                  name="background"
                  placeholder="Describe your background, qualifications, and relevant experience..."
                  className={`min-h-[150px] ${errors.background ? "border-red-500" : ""}`}
                  value={formData.background}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Provide information about your background and qualifications
                </p>
                {errors.background && <p className="text-sm text-red-500">{errors.background}</p>}
              </div>

              {/* Impact Field */}
              <div className="space-y-2">
                <label htmlFor="impact" className="text-sm font-medium">
                  Expected Impact
                </label>
                <Textarea
                  id="impact"
                  name="impact"
                  placeholder="Describe the expected outcomes and impact of your project..."
                  className={`min-h-[150px] ${errors.impact ? "border-red-500" : ""}`}
                  value={formData.impact}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">Explain how your project will make a difference</p>
                {errors.impact && <p className="text-sm text-red-500">{errors.impact}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  )
}

