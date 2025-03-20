"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-Supabase"

// Import the server action
import { createMentorshipRequest } from "@/app/actions/mentor-actions"

const mentorshipRequestSchema = z.object({
  goals: z.string().min(50, { message: "Goals must be at least 50 characters." }),
  experience: z.string().min(50, { message: "Experience must be at least 50 characters." }),
  frequency: z.string().min(1, { message: "Please select a preferred frequency." }),
  duration: z.string().min(1, { message: "Please select a preferred duration." }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export default function MentorshipRequestPage() {
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

  const form = useForm<z.infer<typeof mentorshipRequestSchema>>({
    resolver: zodResolver(mentorshipRequestSchema),
    defaultValues: {
      goals: "",
      experience: "",
      frequency: "",
      duration: "",
      agreeTerms: false,
    },
  })

  // Replace the onSubmit function with this:
  async function onSubmit(values: z.infer<typeof mentorshipRequestSchema>) {
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
      const formData = new FormData()
      formData.append("mentorId", mentorId)
      formData.append("menteeId", user.id)
      formData.append("goals", values.goals)
      formData.append("experience", values.experience)
      formData.append("frequency", values.frequency)
      formData.append("duration", values.duration)

      const result = await createMentorshipRequest(formData)

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Goals</CardTitle>
              <CardDescription>Tell us what you hope to achieve through this mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are your goals for this mentorship?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you hope to achieve and learn from this mentorship..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about what skills you want to develop or challenges you want to overcome
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your current experience level?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your background, current role, and experience level..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps the mentor understand your background and tailor their guidance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Preferences</CardTitle>
              <CardDescription>Tell us how you'd like to structure the mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Meeting Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often would you like to meet with your mentor?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Mentorship Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="3-months">3 months</SelectItem>
                        <SelectItem value="6-months">6 months</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How long would you like the mentorship to last?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the mentorship terms and conditions</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Request..." : "Submit Mentorship Request"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

