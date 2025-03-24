"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface CancelRegistrationDialogProps {
  registrationId: string
  userId: string
  workshopTitle: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelRegistrationDialog({
  registrationId,
  userId,
  workshopTitle,
  isOpen,
  onOpenChange,
}: CancelRegistrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("registrationId", registrationId)
      formData.append("userId", userId)

      // Import the action dynamically to avoid issues
      const { cancelRegistration } = await import("@/app/actions/workshop-actions")
      const result = await cancelRegistration(formData)

      if (result.success) {
        toast.success("Registration cancelled successfully")
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to cancel registration")
      }
    } catch (error) {
      console.error("Error cancelling registration:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your registration for <strong>{workshopTitle}</strong>? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, cancel registration"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
