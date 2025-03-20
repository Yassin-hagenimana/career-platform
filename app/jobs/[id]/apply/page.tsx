"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Form state
  const [fullName, setFullName] = useState("")
  const [currentPosition, setCurrentPosition] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [portfolioUrl, setPortfolioUrl] = useState("")

  // Add the new state variables for salary expectation and experience
  // Add these after the existing form state variables (around line 22)
  const [salaryExpectation, setSalaryExpectation] = useState("")
  const [experience, setExperience] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase.from("jobs").select("*").eq("id", params.id).single()

        if (error) throw error
        if (!data) throw new Error("Job not found")

        setJob(data)

        // Pre-fill form if user is logged in
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email, phone, linkedin_profile, portfolio_url")
            .eq("id", user.id)
            .single()

          if (profile) {
            setFullName(profile.full_name || "")
            setEmail(profile.email || "")
            setPhone(profile.phone || "")
            setLinkedinUrl(profile.linkedin_profile || "")
            setPortfolioUrl(profile.portfolio_url || "")
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error)
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        })
        router.push("/jobs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [params.id, supabase, toast, router, user])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!fullName.trim()) {
      errors.fullName = "Full name is required"
    }

    if (!currentPosition.trim()) {
      errors.currentPosition = "Current position is required"
    }

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required"
    }

    if (!coverLetter.trim()) {
      errors.coverLetter = "Cover letter is required"
    } else if (coverLetter.length < 100) {
      errors.coverLetter = "Cover letter should be at least 100 characters"
    }

    if (!resumeUrl.trim()) {
      errors.resumeUrl = "Resume URL is required"
    } else if (!/^https?:\/\/\S+$/.test(resumeUrl)) {
      errors.resumeUrl = "Please enter a valid URL"
    }

    // Update the validateForm function to include validation for the new fields
    // Add these validations inside the validateForm function
    if (!experience) {
      errors.experience = "Experience is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for this job",
        variant: "destructive",
      })
      router.push(`/auth/login?redirect=/jobs/${params.id}/apply`)
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
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          job_id: params.id,
          user_id: user.id,
          full_name: fullName,
          current_position: currentPosition,
          email: email,
          phone: phone,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          linkedin_profile: linkedinUrl || null,
          portfolio_website: portfolioUrl || null,
          status: "pending",
          // Add the new fields to the form submission
          // Update the supabase insert object in the handleSubmit function to include:
          salary_expectation: salaryExpectation || null,
          experience: experience,
        })
        .select()

      if (error) throw error

      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      })

      router.push(`/dashboard/jobs`)
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

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="space-y-4">
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/jobs/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apply for {job.title}</CardTitle>
            <CardDescription>
              at {job.company} • {job.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={formErrors.fullName ? "border-red-500" : ""}
                />
                {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="fullName">Current Position</Label>
                <Input
                  id="fullName"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  className={formErrors.currentPosition ? "border-red-500" : ""}
                />
                {formErrors.currentPosition && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.currentPosition}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Explain why you're a good fit for this position..."
                  className={`min-h-[200px] ${formErrors.coverLetter ? "border-red-500" : ""}`}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                {formErrors.coverLetter && <p className="text-sm text-red-500 mt-1">{formErrors.coverLetter}</p>}
              </div>

              <div>
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  placeholder="https://example.com/my-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className={formErrors.resumeUrl ? "border-red-500" : ""}
                />
                <p className="text-sm text-muted-foreground mt-1">Link to your resume (Google Drive, Dropbox, etc.)</p>
                {formErrors.resumeUrl && <p className="text-sm text-red-500 mt-1">{formErrors.resumeUrl}</p>}
              </div>

              {/* Add the UI elements for the new fields */}
              {/* Add this after the resumeUrl field and before the LinkedIn/Portfolio section: */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <select
                    id="experience"
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formErrors.experience ? "border-red-500" : "border-input"}`}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Select your experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {formErrors.experience && <p className="text-sm text-red-500 mt-1">{formErrors.experience}</p>}
                </div>

                <div>
                  <Label htmlFor="salaryExpectation">Salary Expectation (USD/year)</Label>
                  <Input
                    id="salaryExpectation"
                    placeholder="e.g. 50000"
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Optional</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="portfolioUrl">Portfolio/Website (Optional)</Label>
                  <Input
                    id="portfolioUrl"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

