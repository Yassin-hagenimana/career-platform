import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApplicationSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-20 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>Your funding application has been received</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Thank you for submitting your funding application. We have received your information and will review it
            shortly.
          </p>
          <p className="text-muted-foreground">
            You will receive an email confirmation with further details about the application process and next steps.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/funding">Browse More Opportunities</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

