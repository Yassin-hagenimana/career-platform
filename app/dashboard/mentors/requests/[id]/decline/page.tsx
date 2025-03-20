"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/hooks/use-Supabase"

export default function DeclineMentorshipRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [request, setRequest] = useState<any>(null)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const requestId = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        // Fetch the request and check if the current user is the mentor
        const { data: requestData, error: requestError } = await supabase
          .from("mentorship_requests")
          .select(`
            id,
            goals,
            experience,
            frequency,
            duration,
            status,
            mentor_id,
            mentors (
              user_id
            ),
            users (
              id,
              name,
              avatar_url
            )
          `)
          .eq("id", requestId)
          .single()

        if (requestError) throw requestError

        // Check if the current user is the mentor for this request
        if (requestData.mentors.user_id !== session.user.id) {
          setError("You don't have permission to decline this request")
          return
        }

        // Check if the request is already accepted or rejected
        if (requestData.status !== "pending") {
          setError("This request has already been processed")
          return
        }

        setRequest(requestData)
      } catch (error) {
        console.error("Error fetching request:", error)
        setError("Failed to load request details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [requestId, router, supabase])

  const handleDecline = async () => {
    setIsSubmitting(true)

    try {
      // Update the request status to rejected
      const { error: updateError } = await supabase
        .from("mentorship_requests")
        .update({
          status: "rejected",
          response_message: reason || null,
        })
        .eq("id", requestId)

      if (updateError) throw updateError

      // TODO: Send notification to the mentee

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error declining request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to decline request",
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

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard/mentors">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Request Declined</CardTitle>
            <CardDescription>You've declined the mentorship request from {request?.users.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              The mentee has been notified that you're unable to accept their request at this time.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard/mentors">Return to Dashboard</Link>
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
          <Link href="/dashboard/mentors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Decline Mentorship Request</h1>
        <p className="text-muted-foreground mt-2">You're declining a mentorship request from {request?.users.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Review the mentorship request before declining</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Goals</h3>
            <p className="text-muted-foreground">{request?.goals}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Experience</h3>
            <p className="text-muted-foreground">{request?.experience}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Preferred Frequency</h3>
              <p className="text-muted-foreground">{request?.frequency}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Preferred Duration</h3>
              <p className="text-muted-foreground">{request?.duration}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Reason for Declining (Optional)</h3>
            <Textarea
              placeholder="Provide a reason for declining this request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This message will be included in the notification sent to the mentee.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/mentors">Cancel</Link>
          </Button>
          <Button onClick={handleDecline} disabled={isSubmitting} variant="destructive">
            {isSubmitting ? "Declining..." : "Decline Request"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

