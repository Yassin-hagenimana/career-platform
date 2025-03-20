import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Building, MapPin, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function JobApplicationDetailsPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the application data based on the ID
  const applicationId = params.id

  // Mock data for demonstration
  const application = {
    id: applicationId,
    jobTitle: "Senior Software Developer",
    company: "Tech Innovations Africa",
    location: "Nairobi, Kenya",
    appliedDate: "2023-10-15",
    status: "under_review", // pending, under_review, interview, rejected, accepted
    coverLetter:
      "I am writing to express my interest in the Senior Software Developer position at Tech Innovations Africa. With over 5 years of experience in full-stack development and a passion for creating innovative solutions, I believe I would be a valuable addition to your team...",
    resume: "/path/to/resume.pdf",
    interviews: [
      {
        id: "int-1",
        type: "Technical Interview",
        date: "2023-10-25",
        time: "10:00 AM",
        location: "Virtual (Zoom)",
        notes: "Prepare to discuss previous projects and technical skills.",
      },
    ],
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    interview: "bg-purple-100 text-purple-800",
    rejected: "bg-red-100 text-red-800",
    accepted: "bg-green-100 text-green-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    interview: "Interview Stage",
    rejected: "Not Selected",
    accepted: "Accepted",
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{application.jobTitle}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  {application.company}
                </CardDescription>
              </div>
              <Badge className={statusColors[application.status]}>{statusLabels[application.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {application.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Applied on {new Date(application.appliedDate).toLocaleDateString()}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Application Status Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Application Under Review</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        new Date(application.appliedDate).getTime() + 3 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {application.status === "interview" || application.status === "accepted" ? (
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Interview Scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.interviews[0].date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : application.status === "rejected" ? (
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Application Not Selected</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          new Date(application.appliedDate).getTime() + 7 * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start opacity-50">
                    <div className="mr-3 mt-0.5">
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Next Steps Pending</p>
                      <p className="text-sm text-muted-foreground">Awaiting employer review</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {application.interviews && application.interviews.length > 0 && (
              <>
                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Scheduled Interviews</h3>
                  <Card>
                    <CardContent className="p-4">
                      {application.interviews.map((interview) => (
                        <div key={interview.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{interview.type}</h4>
                            <Badge variant="outline">{interview.location}</Badge>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(interview.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {interview.time}
                            </div>
                          </div>
                          {interview.notes && (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              Note: {interview.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p>{application.coverLetter}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Attached Resume</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href={application.resume} target="_blank">
                  View Resume
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/jobs">Back to Applications</Link>
            </Button>
            <Button asChild>
              <Link href={`/jobs/${applicationId.split("-")[0]}`}>View Job Posting</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

