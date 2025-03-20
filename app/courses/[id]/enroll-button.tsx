"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface EnrollButtonProps {
  courseId: string
  courseUrl?: string
  isEnrolled: boolean
}

export function EnrollButton({ courseId, courseUrl, isEnrolled }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEnrollClick = () => {
    setIsLoading(true)
    // Navigate to the enrollment form page
    router.push(`/courses/${courseId}/enroll`)
  }

  if (isEnrolled) {
    return (
      <Button className="w-full" asChild>
        <a href={courseUrl || `/dashboard/courses/${courseId}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Access Course
        </a>
      </Button>
    )
  }

  return (
    <Button className="w-full" onClick={handleEnrollClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "Enroll Now"}
    </Button>
  )
}

