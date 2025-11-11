"use client"

import { Button } from "@/components/ui/button"
import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { Trash } from "lucide-react"
import { useState } from "react"
import { deleteTransfer } from "../actions"
import type { ITransfer } from "../types"
import { toast } from "sonner"

interface DeleteTransferDialogProps {
  transfer: ITransfer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTransferDialog({ transfer, open, onOpenChange }: DeleteTransferDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deleteTransfer(transfer.id)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Transfer deleted successfully")
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Transfer"
      description={
        <>
          Are you sure you want to delete <strong>{transfer.name}</strong>? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isLoading}
    />
  )
}
