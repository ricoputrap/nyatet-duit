"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { ISaving } from "../types"
import { deleteSaving } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteSavingDialogProps {
  saving: ISaving
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSavingDialog({ saving, open, onOpenChange }: DeleteSavingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteSaving(saving.id)
    setIsDeleting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Saving deleted successfully')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Saving"
      description={
        <>
          Are you sure you want to delete <strong>{saving.name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
