"use client"

import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { ISavingTransaction } from "../types"
import { deleteSavingTransaction } from "../actions"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteSavingTransactionDialogProps {
  transaction: ISavingTransaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSavingTransactionDialog({ transaction, open, onOpenChange }: DeleteSavingTransactionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteSavingTransaction(transaction.id)
    setIsDeleting(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Saving transaction deleted successfully')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Saving Transaction"
      description={
        <>
          Are you sure you want to delete this saving transaction? This action cannot be undone.
        </>
      }
      actionLabel="Delete"
      loadingLabel="Deleting..."
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
