"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface RequestMentorshipButtonProps {
  mentorId: string
  userId: string | null
  className?: string
}

export function RequestMentorshipButton({ mentorId, userId, className }: RequestMentorshipButtonProps) {
  const router = useRouter()

  const handleRequestMentorship = () => {
    router.push(`/mentors/${mentorId}/request`)
  }

  return (
    <Button onClick={handleRequestMentorship} className={className}>
      Request Mentorship
    </Button>
  )
}

