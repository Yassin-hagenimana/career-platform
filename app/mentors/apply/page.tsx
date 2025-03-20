"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { ArrowLeft, Briefcase, Clock, DollarSign, Calendar, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ApplyMentorPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    expertise: [] as string[],
    newExpertise: "",
    experience_years: "",
    bio: "",
    hourly_rate: "",
    availability: "",
    profession: "",
    company: "",
  })

  const [errors, setErrors] = useState({
    expertise: "",
    experience_years: "",
    bio: "",
    hourly_rate: "",
    availability: "",
  })

  // Fetch user and profile data
  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Check if user already has a mentor profile
        const { data: existingMentor, error: mentorError } = await supabase
          .from("mentors")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (existingMentor) {
          toast.info("You already have a mentor profile")
          router.push("/dashboard/mentors")
          return
        }

        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // Profile not found, redirect to create profile
            toast.error("Please complete your profile first")
            router.push("/dashboard/profile")
            return
          }
          throw profileError
        }

        // Check if profile has required fields
        if (!profile.full_name || !profile.title) {
          toast.error("Please complete your profile before applying as a mentor")
          router.push("/dashboard/profile")
          return
        }

        setProfile(profile)

        // Pre-fill form with profile data if available
        setFormData((prev) => ({
          ...prev,
          expertise: profile.skills || [],
          bio: profile.bio || "",
          profession: profile.title || "",
        }))
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [supabase, router])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Add a new expertise
  const handleAddExpertise = () => {
    if (formData.newExpertise.trim() && !formData.expertise.includes(formData.newExpertise.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, prev.newExpertise.trim()],
        newExpertise: "",
      }))
      setErrors((prev) => ({ ...prev, expertise: "" }))
    }
  }

  // Remove an expertise
  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((exp) => exp !== expertiseToRemove),
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      expertise: formData.expertise.length === 0 ? "Please add at least one area of expertise" : "",
      experience_years: !formData.experience_years
        ? "Years of experience is required"
        : isNaN(Number(formData.experience_years))
          ? "Please enter a valid number"
          : "",
      bio: !formData.bio.trim()
        ? "Bio is required"
        : formData.bio.length < 50
          ? "Bio should be at least 50 characters"
          : "",
      hourly_rate: !formData.hourly_rate
        ? "Hourly rate is required"
        : isNaN(Number(formData.hourly_rate))
          ? "Please enter a valid number"
          : "",
      availability: !formData.availability.trim() ? "Availability is required" : "",
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some((error) => error !== "")
  }

  // Submit application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    try {
      setSubmitting(true)

      // Submit mentor application
      const { data, error } = await supabase
        .from("mentors")
        .insert({
          user_id: user.id,
          expertise: formData.expertise,
          experience_years: Number.parseInt(formData.experience_years),
          bio: formData.bio.trim(),
          hourly_rate: Number.parseFloat(formData.hourly_rate),
          availability: formData.availability.trim(),
          profession: formData.profession.trim(),
          company: formData.company.trim(),
          is_approved: true, // Requires admin approval
        })
        .select()

      if (error) throw error

      toast.success("Your mentor application has been submitted")
      router.push("/dashboard/mentors")
    } catch (error: any) {
      console.error("Error submitting mentor application:", error)
      toast.error("Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/mentors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mentors
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Become a Mentor</h1>
        <p className="text-muted-foreground mt-2">Share your expertise and help others grow in their careers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed on your mentor profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input id="profile-name" value={profile?.full_name || ""} disabled />
                  <p className="text-xs text-muted-foreground mt-1">
                    <Link href="/dashboard/profile" className="text-primary hover:underline">
                      Edit in profile settings
                    </Link>
                  </p>
                </div>

                <div>
                  <label htmlFor="profession" className="text-sm font-medium">
                    Professional Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profession"
                      name="profession"
                      placeholder="e.g. Senior Developer"
                      className="pl-10"
                      value={formData.profession}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Acme Corporation"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about your professional background, experience, and what you can offer as a mentor..."
                  className="min-h-32"
                  value={formData.bio}
                  onChange={handleChange}
                />
                {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expertise & Experience</CardTitle>
              <CardDescription>Share your areas of expertise and professional experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="expertise" className="text-sm font-medium">
                  Areas of Expertise <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="newExpertise"
                    name="newExpertise"
                    placeholder="Add an area of expertise"
                    value={formData.newExpertise}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddExpertise()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddExpertise}>
                    Add
                  </Button>
                </div>

               {Array.isArray(formData.expertise) && formData.expertise.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
          {formData.expertise.map((expertise, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
          {expertise}
         <button
          type="button"
          className="ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => handleRemoveExpertise(expertise)}
        >
          ×
        </button>
       </Badge>
      ))}
       </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No areas of expertise added yet. Add your specializations to help mentees find you.
                  </p>
                )}

                {errors.expertise && <p className="text-sm text-red-500 mt-1">{errors.expertise}</p>}
              </div>

              <div>
                <label htmlFor="experience_years" className="text-sm font-medium">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    className="pl-10"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>
                {errors.experience_years && <p className="text-sm text-red-500 mt-1">{errors.experience_years}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Details</CardTitle>
              <CardDescription>Set your mentorship preferences and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="hourly_rate" className="text-sm font-medium">
                  Hourly Rate (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hourly_rate"
                    name="hourly_rate"
                    type="number"
                    min="0"
                    step="5"
                    placeholder="e.g. 50"
                    className="pl-10"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                  />
                </div>
                {errors.hourly_rate && <p className="text-sm text-red-500 mt-1">{errors.hourly_rate}</p>}
              </div>

              <div>
                <label htmlFor="availability" className="text-sm font-medium">
                  Availability <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="availability"
                    name="availability"
                    placeholder="e.g. Weekends, Evenings EST"
                    className="pl-10"
                    value={formData.availability}
                    onChange={handleChange}
                  />
                </div>
                {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Review your information before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Application Review Process</p>
                      <p className="text-sm text-muted-foreground">
                        Your application will be reviewed by our team. This process typically takes 1-3 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Mentor Guidelines</p>
                      <p className="text-sm text-muted-foreground">
                        By submitting this application, you agree to follow our mentor guidelines and code of conduct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/mentors">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

