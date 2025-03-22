"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

import { createMentorshipRequest } from "@/app/actions/mentor-actions"

const MentorshipRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mentor, setMentor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const mentorId = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { supabase } = useSupabase()

  const [formData, setFormData] = useState({
    goals: "",
    experience: "",
    frequency: "",
    duration: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({
    goals: "",
    experience: "",
    frequency: "",
    duration: "",
    agreeTerms: "",
  })

  const validateForm = () => {
    const newErrors = {
      goals: "",
      experience: "",
      frequency: "",
      duration: "",
      agreeTerms: "",
    }

    let isValid = true

    if (formData.goals.length < 50) {
      newErrors.goals = "Goals must be at least 50 characters."
      isValid = false
    }

    if (formData.experience.length < 50) {
      newErrors.experience = "Experience must be at least 50 characters."
      isValid = false
    }

    if (!formData.frequency) {
      newErrors.frequency = "Please select a preferred frequency."
      isValid = false
    }

    if (!formData.duration) {
      newErrors.duration = "Please select a preferred duration."
      isValid = false
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Fetch mentor details
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select(`
            id, 
            profession, 
            company, 
            expertise, 
            availability,
            users (
              id, 
              name, 
              avatar_url
            )
          `)
          .eq("id", mentorId)
          .single()

        if (error) throw error

        setMentor(data)
      } catch (error) {
        console.error("Error fetching mentor:", error)
        setError("Failed to load mentor details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentor()
  }, [mentorId, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to request mentorship",
        variant: "destructive",
      })
      router.push(`/auth/login?redirect=/mentors/${mentorId}/request`)
      return
    }

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("mentorId", mentorId)
      formDataObj.append("menteeId", user.id)
      formDataObj.append("goals", formData.goals)
      formDataObj.append("experience", formData.experience)
      formDataObj.append("frequency", formData.frequency)
      formDataObj.append("duration", formData.duration)

      const result = await createMentorshipRequest(formDataObj)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting mentorship request:", error)
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-40 bg-muted rounded"></div>
            <div className="h-64 w-full max-w-3xl bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !mentor) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Mentor Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The mentor you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link href="/mentors">Browse All Mentors</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Mentorship Request Submitted!</CardTitle>
            <CardDescription>Your request has been sent to {mentor.users.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              We've sent your mentorship request. The mentor will review your request and respond within a few days.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Wait for the mentor to review your request (typically 2-3 days)</li>
                <li>If accepted, you'll receive a notification to schedule your first session</li>
                <li>Prepare for your first mentorship session</li>
                <li>Meet your mentor and begin your mentorship journey</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/mentors">Browse More Mentors</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/mentors/${mentorId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentor Profile
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Request Mentorship</h1>
        <p className="text-muted-foreground mt-2">Request mentorship from {mentor.users.name}</p>
      </div>

      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={mentor.users.avatar_url || "/placeholder.svg?height=80&width=80"}
                  alt={mentor.users.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xl font-semibold">{mentor.users.name}</h3>
                  <p className="text-muted-foreground">
                    {mentor.profession} at {mentor.company}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((expertise: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    >
                      {expertise}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Availability:</span> {mentor.availability}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Mentorship Goals</CardTitle>
            <CardDescription>Tell us what you hope to achieve through this mentorship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="goals" className="text-sm font-medium">
                What are your goals for this mentorship?
              </label>
              <Textarea
                id="goals"
                placeholder="Describe what you hope to achieve and learn from this mentorship..."
                className="min-h-[150px]"
                value={formData.goals}
                onChange={(e) => handleInputChange("goals", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Be specific about what skills you want to develop or challenges you want to overcome
              </p>
              {errors.goals && <p className="text-sm text-destructive">{errors.goals}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium">
                What is your current experience level?
              </label>
              <Textarea
                id="experience"
                placeholder="Describe your background, current role, and experience level..."
                className="min-h-[150px]"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This helps the mentor understand your background and tailor their guidance
              </p>
              {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentorship Preferences</CardTitle>
            <CardDescription>Tell us how you'd like to structure the mentorship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium">
                Preferred Meeting Frequency
              </label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How often would you like to meet with your mentor?</p>
              {errors.frequency && <p className="text-sm text-destructive">{errors.frequency}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Preferred Mentorship Duration
              </label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1 month</SelectItem>
                  <SelectItem value="3-months">3 months</SelectItem>
                  <SelectItem value="6-months">6 months</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How long would you like the mentorship to last?</p>
              {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
            </div>

            <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Mentee Expectations</p>
                <p>As a mentee, you'll be expected to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Come prepared to each session with specific questions or topics</li>
                  <li>Be respectful of your mentor's time and expertise</li>
                  <li>Follow through on any agreed-upon action items</li>
                  <li>Provide feedback on the mentorship experience</li>
                  <li>Give adequate notice if you need to reschedule a session</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm h-40 overflow-y-auto">
              <p className="mb-2">By requesting mentorship, you agree to the following terms:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>All information provided is true and accurate to the best of your knowledge.</li>
                <li>You understand that mentors volunteer their time and expertise.</li>
                <li>You will respect the mentor's time and provide adequate notice for cancellations.</li>
                <li>You will maintain confidentiality of discussions with your mentor.</li>
                <li>You understand that the mentor may decline your request based on availability or fit.</li>
                <li>You will provide feedback on the mentorship experience when requested.</li>
              </ol>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked === true)}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="agreeTerms" className="text-sm font-medium">
                  I agree to the mentorship terms and conditions
                </label>
                {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Request..." : "Submit Mentorship Request"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default MentorshipRequestPage

