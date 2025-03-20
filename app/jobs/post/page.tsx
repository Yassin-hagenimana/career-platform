"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  // Form state
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [benefits, setBenefits] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [companyDescription, setCompanyDescription] = useState("")
  const [logo, setLogo] = useState("")

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (title.length < 5) {
      errors.title = "Job title must be at least 5 characters."
    }
    if (company.length < 2) {
      errors.company = "Company name must be at least 2 characters."
    }
    if (location.length < 2) {
      errors.location = "Location must be at least 2 characters."
    }
    if (!jobType) {
      errors.jobType = "Please select a job type."
    }
    if (!category) {
      errors.category = "Please select a job category."
    }
    if (!level) {
      errors.level = "Please select an experience level."
    }
    if (description.length < 100) {
      errors.description = "Job description must be at least 100 characters."
    }
    if (requirements.length < 50) {
      errors.requirements = "Requirements must be at least 50 characters."
    }
    if (responsibilities.length < 50) {
      errors.responsibilities = "Responsibilities must be at least 50 characters."
    }
    if (benefits.length < 50) {
      errors.benefits = "Benefits must be at least 50 characters."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      })
      router.push("/auth/login?redirect=/jobs/post")
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Submit job to Supabase
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title,
          company,
          location,
          type: jobType,
          category,
          level,
          salary: salary || null,
          description,
          requirements,
          responsibilities,
          benefits,
          is_remote: isRemote,
          company_description: companyDescription || null,
          logo: logo || null,
          user_id: user.id,
          applications_count: 0,
        })
        .select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Your job has been posted successfully.",
      })

      router.push(`/jobs/${data[0].id}`)
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Post a Job</h1>
        <p className="text-muted-foreground mt-2">Fill out the form below to post a new job listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details about the job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Frontend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g. Acme Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={formErrors.company ? "border-red-500" : ""}
                />
                {formErrors.company && <p className="text-sm text-red-500 mt-1">{formErrors.company}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={formErrors.location ? "border-red-500" : ""}
                />
                {formErrors.location && <p className="text-sm text-red-500 mt-1">{formErrors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="jobType">Job Type</Label>
                <Select onValueChange={setJobType} value={jobType}>
                  <SelectTrigger id="jobType" className={formErrors.jobType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.jobType && <p className="text-sm text-red-500 mt-1">{formErrors.jobType}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger id="category" className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Development">Software Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>}
              </div>

              <div>
                <Label htmlFor="level">Experience Level</Label>
                <Select onValueChange={setLevel} value={level}>
                  <SelectTrigger id="level" className={formErrors.level ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.level && <p className="text-sm text-red-500 mt-1">{formErrors.level}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="salary">Salary Range (Optional)</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $80,000 - $100,000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">Leave blank to not disclose</p>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Remote Position</Label>
                  <p className="text-sm text-muted-foreground">Is this a remote position?</p>
                </div>
                <Switch checked={isRemote} onCheckedChange={setIsRemote} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide detailed information about the job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job role, responsibilities, and the ideal candidate..."
                className={`min-h-[150px] ${formErrors.description ? "border-red-500" : ""}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the skills, qualifications, and experience required for this role..."
                className={`min-h-[150px] ${formErrors.requirements ? "border-red-500" : ""}`}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter each requirement on a new line</p>
              {formErrors.requirements && <p className="text-sm text-red-500 mt-1">{formErrors.requirements}</p>}
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="List the key responsibilities and duties for this role..."
                className={`min-h-[150px] ${formErrors.responsibilities ? "border-red-500" : ""}`}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter each responsibility on a new line</p>
              {formErrors.responsibilities && (
                <p className="text-sm text-red-500 mt-1">{formErrors.responsibilities}</p>
              )}
            </div>

            <div>
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="List the benefits and perks offered with this position..."
                className={`min-h-[150px] ${formErrors.benefits ? "border-red-500" : ""}`}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter each benefit on a new line</p>
              {formErrors.benefits && <p className="text-sm text-red-500 mt-1">{formErrors.benefits}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Provide additional information about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="companyDescription">Company Description (Optional)</Label>
              <Textarea
                id="companyDescription"
                placeholder="Tell potential candidates about your company, culture, and values..."
                className="min-h-[100px]"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="logo">Company Logo URL (Optional)</Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Enter a URL to your company logo</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Posting Job..." : "Post Job"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

