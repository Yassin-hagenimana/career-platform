"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ArrowLeft } from "lucide-react"

// Sample mentor data (in a real app, this would be fetched based on the ID)
const mentors = [
  {
    id: "1",
    name: "Dr. Amina Diallo",
    title: "Senior Software Engineer at Google",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Software Development", "Career Transitions", "Technical Interviews"],
    rating: 4.9,
    reviews: 42,
    availability: "2-3 hours/week",
  },
  {
    id: "2",
    name: "Michael Okafor",
    title: "Startup Founder & Business Coach",
    image: "/placeholder.svg?height=200&width=200",
    expertise: ["Entrepreneurship", "Business Strategy", "Fundraising"],
    rating: 4.8,
    reviews: 35,
    availability: "1-2 hours/week",
  },
]

const formSchema = z.object({
  goals: z.string().min(10, { message: "Please describe your goals in at least 10 characters" }),
  experience: z.string().min(10, { message: "Please describe your experience in at least 10 characters" }),
  frequency: z.string().min(1, { message: "Please select a preferred meeting frequency" }),
  duration: z.string().min(1, { message: "Please select a preferred mentorship duration" }),
  agree: z.boolean().refine((val) => val === true, { message: "You must agree to the terms" }),
})

export default function MentorshipRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const mentorId = searchParams.get("mentor") || "1"

  // Find the mentor based on the ID from the URL
  const mentor = mentors.find((m) => m.id === mentorId) || mentors[0]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: "",
      experience: "",
      frequency: "",
      duration: "",
      agree: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(values)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect after showing success message
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/mentorship">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentors
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Request Mentorship</h1>
        <p className="text-muted-foreground">Complete this form to request mentorship from {mentor.name}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <div className="relative h-48 w-full">
              <Image src={mentor.image || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{mentor.name}</CardTitle>
              <CardDescription>{mentor.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {mentor.expertise.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>
                    {mentor.rating} ({mentor.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{mentor.availability}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Request Form</CardTitle>
              <CardDescription>
                Please provide information about your goals and expectations for this mentorship
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-green-600"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Request Submitted Successfully!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your mentorship request has been sent to {mentor.name}. You will be notified when they respond.
                  </p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your career goals?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what you hope to achieve in your career and how a mentor could help..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Be specific about your short-term and long-term goals</FormDescription>
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
                              placeholder="Describe your background, skills, and current role..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>This helps your mentor understand your starting point</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Meeting Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="asneeded">As needed</SelectItem>
                              </SelectContent>
                            </Select>
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
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1month">1 month</SelectItem>
                                <SelectItem value="3months">3 months</SelectItem>
                                <SelectItem value="6months">6 months</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="agree"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to respect the mentor's time and follow the platform's code of conduct
                            </FormLabel>
                            <FormDescription>
                              By checking this box, you commit to being punctual, prepared, and professional in all
                              mentorship interactions.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

