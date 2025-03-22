"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteWorkshopDialog } from "./delete-workshop-dialog"

interface DeleteWorkshopButtonProps {
  workshopId: string
  userId: string
  workshopTitle: string
}

export function DeleteWorkshopButton({ workshopId, userId, workshopTitle }: DeleteWorkshopButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <DeleteWorkshopDialog
        workshopId={workshopId}
        userId={userId}
        workshopTitle={workshopTitle}
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}

