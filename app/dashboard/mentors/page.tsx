import Link from "next/link"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MessageSquare, UserPlus } from "lucide-react"

// Add error handling for tables not existing
export default async function DashboardMentorsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?redirect=/dashboard/mentors")
  }

  try {
    // Create mentors table if it doesn't exist
    await supabase.rpc("create_mentors_table_if_not_exists")

    // Create mentorship_requests table if it doesn't exist
    await supabase.rpc("create_mentorship_requests_table_if_not_exists")

    // Check if user is a mentor
    const { data: mentorProfile } = await supabase
      .from("mentors")
      .select("id, is_approved")
      .eq("user_id", session.user.id)
      .maybeSingle()

    // Fetch mentorship requests if user is a mentor
    let mentorshipRequests = []
    if (mentorProfile?.id) {
      const { data: requests } = await supabase
        .from("mentorship_requests")
        .select(`
          id,
          goals,
          experience,
          frequency,
          duration,
          status,
          user:mentee_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq("mentor_id", mentorProfile.id)
        .order("created_at", { ascending: false })

      mentorshipRequests = requests || []
    }

    // Fetch user's mentorship requests as a mentee
    const { data: myRequests } = await supabase
      .from("mentorship_requests")
      .select(`
        id,
        goals,
        frequency,
        duration,
        status,
        created_at,
        mentor:mentor_id (
          id,
          profession,
          company,
          user:user_id (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq("mentee_id", session.user.id)
      .order("created_at", { ascending: false })

    // Format the data to match the expected structure
    const formattedRequests =
      myRequests?.map((request) => ({
        ...request,
        mentors: {
          ...request.mentor,
          users: request.mentor.user,
        },
      })) || []

    const data = {
      mentorProfile,
      mentorshipRequests,
      myRequests: formattedRequests,
    }

    return <DashboardMentorsPageContent {...data} />
  } catch (error) {
    console.error("Error in DashboardMentorsPage:", error)
    return <div>Error</div>
  }
}

interface DashboardMentorsPageContentProps {
  mentorProfile: any
  mentorshipRequests: any[]
  myRequests: any[]
}

function DashboardMentorsPageContent({
  mentorProfile,
  mentorshipRequests,
  myRequests,
}: DashboardMentorsPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mentorship</h1>
          <p className="text-muted-foreground">Manage your mentorship connections and requests</p>
        </div>

        {!mentorProfile && (
          <Button asChild>
            <Link href="/mentors/apply">
              <UserPlus className="mr-2 h-4 w-4" />
              Become a Mentor
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          {mentorProfile?.id && (
            <TabsTrigger value="mentor-requests">
              Mentorship Requests
              {mentorshipRequests.filter((r) => r.status === "pending").length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {mentorshipRequests.filter((r) => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-requests" className="space-y-4">
          {myRequests && myRequests.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Mentorship Requests</CardTitle>
                <CardDescription>You haven't requested mentorship from anyone yet</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with a mentor to get personalized guidance for your career journey
                </p>
                <Button asChild>
                  <Link href="/mentors">Browse Mentors</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myRequests &&
                myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={request.mentors.users.avatar_url || "/placeholder.svg?height=40&width=40"}
                            alt={request.mentors.users.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{request.mentors.users.name}</CardTitle>
                          <CardDescription>
                            {request.mentors.profession} at {request.mentors.company}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Frequency: {request.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>Duration: {request.duration}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">My Goals:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{request.goals}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-0">
                      <Badge
                        variant={
                          request.status === "accepted"
                            ? "success"
                            : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {request.status === "pending"
                          ? "Pending"
                          : request.status === "accepted"
                            ? "Accepted"
                            : "Declined"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mentors/${request.mentors.id}`}>View Mentor</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {mentorProfile?.id && (
          <TabsContent value="mentor-requests" className="space-y-4">
            {!mentorProfile.is_approved && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Application Under Review</CardTitle>
                  <CardDescription className="text-yellow-700">
                    Your mentor application is still being reviewed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">
                    Once approved, you'll be able to receive and manage mentorship requests. We'll notify you when your
                    application has been reviewed.
                  </p>
                </CardContent>
              </Card>
            )}

            {mentorProfile.is_approved && mentorshipRequests.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>No Mentorship Requests</CardTitle>
                  <CardDescription>You haven't received any mentorship requests yet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When someone requests mentorship from you, their request will appear here
                  </p>
                </CardContent>
              </Card>
            )}

            {mentorProfile.is_approved && mentorshipRequests.length > 0 && (
              <div className="grid gap-4">
                {mentorshipRequests.map((request) => (
                  <MentorshipRequestCard key={request.id} request={request} mentorId={mentorProfile.id} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

// This would be a client component to handle request actions
function MentorshipRequestCard({ request, mentorId }) {
  const isPending = request.status === "pending"

  return (
    <Card key={request.id} className={isPending ? "border-blue-200" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={request.user.avatar_url || "/placeholder.svg?height=40&width=40"}
              alt={request.user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{request.user.name}</CardTitle>
            <CardDescription>Requested {new Date(request.created_at).toLocaleDateString()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Frequency: {request.frequency}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {request.duration}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Goals:</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{request.goals}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm">Experience:</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{request.experience}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <Badge
          variant={
            request.status === "accepted" ? "success" : request.status === "rejected" ? "destructive" : "secondary"
          }
        >
          {request.status === "pending" ? "Pending" : request.status === "accepted" ? "Accepted" : "Declined"}
        </Badge>

        {isPending ? (
          <div className="flex gap-2">
            <Link href={`/dashboard/mentors/requests/${request.id}/accept`}>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Accept
              </Button>
            </Link>
            <Link href={`/dashboard/mentors/requests/${request.id}/decline`}>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Decline
              </Button>
            </Link>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/mentors/requests/${request.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

