"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { deleteWorkshop } from "@/app/actions/workshop-actions"

interface DeleteWorkshopDialogProps {
  workshopId: string
  userId: string
  workshopTitle: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteWorkshopDialog({
  workshopId,
  userId,
  workshopTitle,
  isOpen,
  onOpenChange,
}: DeleteWorkshopDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    setIsDeleting(true)

    const formData = new FormData()
    formData.append("workshopId", workshopId)
    formData.append("userId", userId)

    try {
      const result = await deleteWorkshop(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Workshop deleted",
          description: "The workshop has been successfully deleted.",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this workshop?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete &quot;{workshopTitle}&quot;. This action cannot be undone and will also remove all
            registrations for this workshop.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Workshop"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}