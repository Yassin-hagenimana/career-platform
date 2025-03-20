"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

export default function PostJobPage() {
  const [isLoading, setIsLoading] = useState(false)
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
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [featured, setFeatured] = useState(false)
  const [remote, setRemote] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (title.length < 5) {
      errors.title = "Job title must be at least 5 characters."
    }
    if (company.length < 2) {
      errors.company = "Company name is required."
    }
    if (location.length < 2) {
      errors.location = "Location is required."
    }
    if (!jobType) {
      errors.jobType = "Job type is required."
    }
    if (!category) {
      errors.category = "Category is required."
    }
    if (description.length < 50) {
      errors.description = "Description must be at least 50 characters."
    }
    if (requirements.length < 50) {
      errors.requirements = "Requirements must be at least 50 characters."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job.",
        variant: "destructive",
      })
      router.push("/auth/login")
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

    setIsLoading(true)

    try {
      // Prepare job data
      const jobData = {
        title,
        company,
        location: remote ? `Remote (${location})` : location,
        type: jobType,
        category,
        salary: salary || null,
        description,
        requirements,
        featured,
        remote,
        user_id: user.id,
      }

      // Insert job into Supabase
      const { data, error } = await supabase.from("jobs").insert(jobData).select()

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      })

      // Redirect to the job details page
      router.push(`/jobs/${data[0].id}`)
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold">Post a Job</h1>
          <p className="text-lg text-muted-foreground">Reach thousands of qualified candidates across Africa</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide detailed information about the position to attract the right candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="e.g. TechAfrica Solutions"
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
                    placeholder="e.g. Nairobi, Kenya"
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
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
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
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.category && <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="salary">Salary Range (Optional)</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $1,500 - $2,500 / month"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Leave blank to display "Competitive"</p>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and company..."
                  className={`min-h-[150px] ${formErrors.description ? "border-red-500" : ""}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <Label htmlFor="requirements">Requirements & Qualifications</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the skills, experience, and qualifications required..."
                  className={`min-h-[150px] ${formErrors.requirements ? "border-red-500" : ""}`}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
                {formErrors.requirements && <p className="text-sm text-red-500 mt-1">{formErrors.requirements}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox id="remote" checked={remote} onCheckedChange={(checked) => setRemote(checked === true)} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="remote">Remote Position</Label>
                    <p className="text-sm text-muted-foreground">This job can be performed remotely</p>
                  </div>
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Featured Job</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight this job in the featured section (additional fee applies)
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Posting Job..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

